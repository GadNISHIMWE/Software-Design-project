<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    protected $otpService;

    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if username is "Admin" and if an admin already exists
            if ($request->username === 'Admin') {
                $adminExists = User::where('username', 'Admin')->exists();
                if ($adminExists) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Admin account already exists'
                    ], 422);
                }
            }

            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Log the user's email right after creation, before passing to service
            Log::info('User email after creation in AuthController: ' . $user->email);

            // Generate and send OTP
            $this->otpService->generateOTP($user);

            // Return success with email verification required
            return response()->json([
                'status' => 'success',
                'message' => 'Registration successful. Please verify your email with the OTP sent.',
                'requires_email_verification' => true,
                'email' => $user->email,
                'data' => [
                    'user' => $user
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user with the provided email exists
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email not registered. Please register first.'
                ], 404);
            }

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Always generate and send OTP for login verification
            $this->otpService->generateOTP($user);

            // Return success with OTP verification required
            return response()->json([
                'status' => 'success',
                'message' => 'OTP sent. Please verify your identity.',
                'requires_otp_verification' => true,
                'email' => $user->email
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Set is_logged_in to false before deleting the token
            $user = $request->user();
            if ($user) {
                $user->is_logged_in = false;
                $user->save();
            }

            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => $request->user()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyOTP(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'otp' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Verify the OTP
            if (!$this->otpService->verifyOTP($user, $request->otp)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid or expired OTP code'
                ], 422);
            }

            // Mark email as verified ONLY if it's not already verified (initial signup)
            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
                event(new Verified($user));
            }

            // Create token after successful verification
            $token = $user->createToken('auth_token')->plainTextToken;

            // Log user role and isAdmin result before sending response
            Log::info('VerifyOTP - User Role: ' . $user->role);
            Log::info('VerifyOTP - isAdmin result: ' . $user->isAdmin());
            Log::info('VerifyOTP - User data being sent: ' . json_encode($user->toArray()));

            // Set is_logged_in to true
            $user->is_logged_in = true;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'OTP verified successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'is_admin' => $user->isAdmin()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP verification failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function resendOTP(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Generate and send new OTP
            $this->otpService->generateOTP($user);

            return response()->json([
                'status' => 'success',
                'message' => 'OTP sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to resend OTP',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsers()
    {
        try {
            // Ensure only admins can access this endpoint
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $users = User::all();

            return response()->json([
                'status' => 'success',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createUser(Request $request)
    {
        try {
            // Ensure only admins can access this endpoint
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:admin,user',
                // Add validation for other fields like status, location if you add them to the form
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

             // Prevent creating another 'Admin' user if one already exists
            if ($request->username === 'Admin') {
                $adminExists = User::where('username', 'Admin')->exists();
                // Allow creation if no admin exists, otherwise prevent it
                 if ($adminExists) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Admin account already exists'
                    ], 422);
                }
            }

            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                 // Set default permissions for new users (e.g., empty JSON object)
                'permissions' => json_encode([]),
                 // Set a default status if you have a status column
                 // 'status' => 'active',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully.',
                'data' => $user // Return the created user data
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, User $user)
    {
        try {
            // Ensure only admins can access this endpoint
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'username' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
                'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'role' => 'sometimes|string|in:admin,user',
                // Add validation for other fields like status, location if you add them to the form
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Prevent changing the role of the original 'Admin' user if they are trying to make themselves not admin
            if ($user->username === 'Admin' && isset($request->role) && $request->role !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot change the role of the primary admin account.'
                ], 403);
            }

            $user->update($request->only(['name', 'username', 'email', 'role']));

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => $user // Return the updated user data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser(User $user)
    {
        try {
            // Ensure only admins can access this endpoint
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
             // Prevent deleting the primary admin account
            if ($user->username === 'Admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete the primary admin account.'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleUserStatus(User $user)
    {
        try {
            // Ensure only admins can access this endpoint
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
             // Prevent changing status of the primary admin account
            if ($user->username === 'Admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot change status of the primary admin account.'
                ], 403);
            }

            // Toggle status (assuming a simple active/inactive for now, adjust if you have more statuses)
            // You might need a 'status' column in your users table for this.
            // For now, I'll just return a success message, you'll need to implement the actual status change logic.
            // Check current status and toggle
            $newStatus = ($user->status === 'active') ? 'inactive' : 'active'; // Simple toggle between active/inactive
            // If you have 'suspended', you might add more complex logic here

            $user->status = $newStatus;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'User status updated successfully.', // Updated message
                'user' => $user // Return user data, potentially with updated status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to toggle user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePermissions(Request $request, User $user)
    {
        try {
            // Ensure only admins can access this endpoint
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'permissions' => 'required|array',
                'permissions.viewData' => 'required|boolean',
                'permissions.controlSystems' => 'required|boolean',
                'permissions.manageUsers' => 'required|boolean',
                'permissions.viewReports' => 'required|boolean',
                // Add validation for other permissions as needed
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
             // Prevent changing permissions of the primary admin account
            if ($user->username === 'Admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot change permissions of the primary admin account.'
                ], 403);
            }

            // Assuming you have a 'permissions' column (e.g., JSON type) in your users table
            // You'll need to implement the logic to save these permissions.
            // $user->permissions = $request->permissions;
            // $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'User permissions update logic needs implementation.', // Placeholder
                'user' => $user // Return user data, potentially with updated permissions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 
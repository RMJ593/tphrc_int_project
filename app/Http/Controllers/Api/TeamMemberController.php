<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of team members
     */
    public function index()
    {
        $members = TeamMember::orderBy('order', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }

    /**
     * Store a newly created team member
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'bio' => 'nullable|string',
            'facebook' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'position', 'bio', 'facebook', 'twitter', 'instagram', 'order']);

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('team-members', $imageName, 'public');
                $data['image'] = $imagePath;
            }

            $member = TeamMember::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Team member created successfully',
                'data' => $member
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified team member
     */
    public function show($id)
    {
        $member = TeamMember::find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Team member not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $member
        ]);
    }

    /**
     * Update the specified team member
     */
    public function update(Request $request, $id)
    {
        $member = TeamMember::find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Team member not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'bio' => 'nullable|string',
            'facebook' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'position', 'bio', 'facebook', 'twitter', 'instagram', 'order']);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($member->image && Storage::disk('public')->exists($member->image)) {
                    Storage::disk('public')->delete($member->image);
                }

                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('team-members', $imageName, 'public');
                $data['image'] = $imagePath;
            }

            $member->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Team member updated successfully',
                'data' => $member
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified team member
     */
    public function destroy($id)
    {
        $member = TeamMember::find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Team member not found'
            ], 404);
        }

        try {
            // Delete image if exists
            if ($member->image && Storage::disk('public')->exists($member->image)) {
                Storage::disk('public')->delete($member->image);
            }

            $member->delete();

            return response()->json([
                'success' => true,
                'message' => 'Team member deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * Display a listing of pages
     */
    public function index()
    {
        $pages = Page::orderBy('title', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * Store a newly created page
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['title', 'slug', 'content', 'meta_title', 'meta_description']);
            
            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }
            
            $data['is_active'] = $request->has('is_active') ? (bool)$request->is_active : true;

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                $image = $request->file('featured_image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('pages', $imageName, 'public');
                $data['featured_image'] = $imagePath;
            }

            $page = Page::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Page created successfully',
                'data' => $page
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified page
     */
    public function show($id)
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $page
        ]);
    }

    /**
     * Update the specified page
     */
    public function update(Request $request, $id)
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $id,
            'content' => 'sometimes|required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['title', 'slug', 'content', 'meta_title', 'meta_description']);
            
            // Generate slug if title changed and slug is empty
            if ($request->has('title') && empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }
            
            if ($request->has('is_active')) {
                $data['is_active'] = (bool)$request->is_active;
            }

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                // Delete old image if exists
                if ($page->featured_image && Storage::disk('public')->exists($page->featured_image)) {
                    Storage::disk('public')->delete($page->featured_image);
                }

                $image = $request->file('featured_image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('pages', $imageName, 'public');
                $data['featured_image'] = $imagePath;
            }

            $page->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Page updated successfully',
                'data' => $page
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified page
     */
    public function destroy($id)
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        try {
            // Delete featured image if exists
            if ($page->featured_image && Storage::disk('public')->exists($page->featured_image)) {
                Storage::disk('public')->delete($page->featured_image);
            }

            $page->delete();

            return response()->json([
                'success' => true,
                'message' => 'Page deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete page',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
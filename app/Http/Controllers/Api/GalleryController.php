<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials
     */
    public function index()
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $testimonials
        ]);
    }

    /**
     * Store a newly created testimonial
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['customer_name', 'review', 'rating']);
            $data['is_featured'] = $request->has('is_featured') ? (bool)$request->is_featured : false;

            // Handle image upload
            if ($request->hasFile('customer_image')) {
                $image = $request->file('customer_image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('testimonials', $imageName, 'public');
                $data['customer_image'] = $imagePath;
            }

            $testimonial = Testimonial::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial created successfully',
                'data' => $testimonial
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified testimonial
     */
    public function show($id)
    {
        $testimonial = Testimonial::find($id);

        if (!$testimonial) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $testimonial
        ]);
    }

    /**
     * Update the specified testimonial
     */
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::find($id);

        if (!$testimonial) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'customer_name' => 'sometimes|required|string|max:255',
            'customer_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'review' => 'sometimes|required|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'is_featured' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['customer_name', 'review', 'rating']);
            
            if ($request->has('is_featured')) {
                $data['is_featured'] = (bool)$request->is_featured;
            }

            // Handle image upload
            if ($request->hasFile('customer_image')) {
                // Delete old image if exists
                if ($testimonial->customer_image && Storage::disk('public')->exists($testimonial->customer_image)) {
                    Storage::disk('public')->delete($testimonial->customer_image);
                }

                $image = $request->file('customer_image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('testimonials', $imageName, 'public');
                $data['customer_image'] = $imagePath;
            }

            $testimonial->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial updated successfully',
                'data' => $testimonial
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified testimonial
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::find($id);

        if (!$testimonial) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found'
            ], 404);
        }

        try {
            // Delete image if exists
            if ($testimonial->customer_image && Storage::disk('public')->exists($testimonial->customer_image)) {
                Storage::disk('public')->delete($testimonial->customer_image);
            }

            $testimonial->delete();

            return response()->json([
                'success' => true,
                'message' => 'Testimonial deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
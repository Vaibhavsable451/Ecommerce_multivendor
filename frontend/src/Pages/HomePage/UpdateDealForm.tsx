import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { updateDeal } from "../../../State/admin/DealSlice";
import { fetchHomeCategories } from "../../../State/admin/adminSlice";
import { HomeCategory } from "../../../types/HomeCategoryTypes";

interface UpdateDealFormProps {
  id: number;
  onSuccess?: () => void;
}

interface FormValues {
  discount: number;
  category: string;
}

interface AdminState {
  categories: HomeCategory[];
  loading: boolean;
  error: string | null;
  categoryUpdated: boolean;
}

interface RootState {
  admin: AdminState;
}

const validationSchema = Yup.object({
  discount: Yup.number()
    .required("Discount is required")
    .min(0, "Discount must be a positive number")
    .max(100, "Discount cannot exceed 100"),
  category: Yup.string().required("Category is required"),
});

const UpdateDealForm: React.FC<UpdateDealFormProps> = ({ id, onSuccess }) => {
  const { categories, loading } = useAppSelector((state: RootState) => state.admin);
  const dispatch = useAppDispatch();

  const formik = useFormik<FormValues>({
    initialValues: {
      discount: 0,
      category: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(
          updateDeal({
            id,
            deal: {
              discount: values.discount,
              category: { id: Number(values.category) },
            },
          })
        ).unwrap();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to update deal:", error);
      }
    },
  });

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  if (loading) {
    return <Typography>Loading categories...</Typography>;
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Update Deal
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.category && Boolean(formik.errors.category)}
          label="Category"
        >
          {categories.map((category: HomeCategory) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        id="discount"
        name="discount"
        label="Discount Percentage"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.discount && Boolean(formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
        inputProps={{
          min: 1,
          max: 100,
          step: 1,
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3, py: 1.5 }}
        disabled={!formik.isValid || formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Updating...' : 'Update Deal'}
      </Button>
    </Box>
  );
};

export default UpdateDealForm;

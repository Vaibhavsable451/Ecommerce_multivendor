import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Box,
  FormHelperText,
} from "@mui/material";
// Data imports
import { mainCategory } from '../../../data/mainCategory';

// Level Two Category imports
import { menLevelTwo } from '../../../data/category/level two/menLevelTwo';
import { womenLevelTwo } from '../../../data/category/level two/womenLevelTwo';
import { furnitureLevelTwo } from '../../../data/category/level two/furnitureLevelTwo';
import { electronicsLevelTwo } from '../../../data/category/level two/electronicsLevelTwo';

// Level Three Category imports
import { menLevelThree } from '../../../data/category/level three/menLevelThree';
import { womenLevelThree } from '../../../data/category/level three/womenLevelThree';
import { furnitureLevelThree } from '../../../data/category/level three/furnitureLevelThree';
import { electronicsLevelThree } from '../../../data/category/level three/electronicsLevelThree';

// Redux imports
import { useAppDispatch } from '../../../State/Store';
import { updateHomeCategory } from '../../../State/admin/adminSlice';

// Types
import { HomeCategory } from '../../../types/HomeCategoryTypes';

// Define validation schema using Yup
const validationSchema = Yup.object({
  image: Yup.string().required("Image is required"),
  category: Yup.string().required("Category is required"),
});

const categoryTwo: { [key: string]: any[] } = {
  men: menLevelTwo,
  women: womenLevelTwo,
  home_furniture: furnitureLevelTwo,
  beauty: [],
  electronics: electronicsLevelTwo,
};

const categoryThree: { [key: string]: any[] } = {
  men: menLevelThree,
  women: womenLevelThree,
  home_furniture: furnitureLevelThree,
  beauty: [],
  electronics: electronicsLevelThree,
};
const UpdateHomeCategoryForm = ({
  category,
  handleClose,
}: {
  category: HomeCategory | undefined;
  handleClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      image: category?.image || "",
      category: category?.parentCategory?.parentCategory?.categoryId || "",
      category2: category?.parentCategory?.categoryId || "",
      category3: category?.categoryId || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (category?.id) {
        dispatch(
          updateHomeCategory({
            id: category.id,
            data: { 
              image: values.image, 
              categoryId: values.category3 || values.category2 || values.category 
            },
          })
        );
      }
      handleClose();
    },
  });

  // Reset child categories when parent changes
  React.useEffect(() => {
    if (formik.values.category) {
      formik.setFieldValue('category2', '');
      formik.setFieldValue('category3', '');
    }
  }, [formik.values.category]);

  React.useEffect(() => {
    if (formik.values.category2) {
      formik.setFieldValue('category3', '');
    }
  }, [formik.values.category2]);

  const childCategory = (category: any, parentCategoryId: any) => {
    return category.filter((child: any) => {
      // console.log("Category", parentCategoryId, child)
      return child.parentCategoryId == parentCategoryId;
    });
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 500, margin: "auto", padding: 3 }}
      className="space-y-6"
    >
      <Typography variant="h4" gutterBottom>
        Update Category
      </Typography>

      {/* Image Field */}
      <TextField
        fullWidth
        id="image"
        name="image"
        label="Image URL"
        value={formik.values.image}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.image && Boolean(formik.errors.image)}
        helperText={formik.touched.image && formik.errors.image}
      />

      <FormControl
        fullWidth
        error={formik.touched.category && Boolean(formik.errors.category)}
        required
        sx={{ mb: 2 }}
      >
        <InputLabel id="main-category-label">Main Category</InputLabel>
        <Select
          labelId="main-category-label"
          id="category"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Main Category"
        >
          {mainCategory.map((item) => (
            <MenuItem key={item.categoryId} value={item.categoryId}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.category && formik.errors.category && (
          <FormHelperText>{formik.errors.category}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={formik.touched.category2 && Boolean(formik.errors.category2)}
        required
        disabled={!formik.values.category}
        sx={{ mb: 2 }}
      >
        <InputLabel id="sub-category-label">Sub Category</InputLabel>
        <Select
          labelId="sub-category-label"
          id="category2"
          name="category2"
          value={formik.values.category2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Sub Category"
        >
          {formik.values.category &&
            categoryTwo[formik.values.category]?.map((item) => (
              <MenuItem key={item.categoryId} value={item.categoryId}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
        {formik.touched.category2 && formik.errors.category2 && (
          <FormHelperText>Please select a sub category</FormHelperText>
        )}
      </FormControl>
      <FormControl
        fullWidth
        error={formik.touched.category3 && Boolean(formik.errors.category3)}
        sx={{ mb: 3 }}
      >
        <InputLabel id="child-category-label">Child Category (Optional)</InputLabel>
        <Select
          labelId="child-category-label"
          id="category3"
          name="category3"
          value={formik.values.category3}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Child Category (Optional)"
          disabled={!formik.values.category2}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {formik.values.category2 &&
            childCategory(
              categoryThree[formik.values.category] || [],
              formik.values.category2
            )?.map((item: any) => (
              <MenuItem key={item.categoryId} value={item.categoryId}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
        {formik.touched.category3 && formik.errors.category3 && (
          <FormHelperText>{formik.errors.category3}</FormHelperText>
        )}
      </FormControl>

      {/* Submit Button */}
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        sx={{ py: ".9rem" }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default UpdateHomeCategoryForm;

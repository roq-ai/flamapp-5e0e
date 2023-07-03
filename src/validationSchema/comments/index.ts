import * as yup from 'yup';

export const commentValidationSchema = yup.object().shape({
  body: yup.string().required(),
  user_id: yup.string().nullable(),
  content_id: yup.string().nullable(),
});

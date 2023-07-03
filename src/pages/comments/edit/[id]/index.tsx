import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCommentById, updateCommentById } from 'apiSdk/comments';
import { Error } from 'components/error';
import { commentValidationSchema } from 'validationSchema/comments';
import { CommentInterface } from 'interfaces/comment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { ContentInterface } from 'interfaces/content';
import { getUsers } from 'apiSdk/users';
import { getContents } from 'apiSdk/contents';

function CommentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CommentInterface>(
    () => (id ? `/comments/${id}` : null),
    () => getCommentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CommentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCommentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/comments');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CommentInterface>({
    initialValues: data,
    validationSchema: commentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Comment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="body" mb="4" isInvalid={!!formik.errors?.body}>
              <FormLabel>Body</FormLabel>
              <Input type="text" name="body" value={formik.values?.body} onChange={formik.handleChange} />
              {formik.errors.body && <FormErrorMessage>{formik.errors?.body}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<ContentInterface>
              formik={formik}
              name={'content_id'}
              label={'Select Content'}
              placeholder={'Select Content'}
              fetcher={getContents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'comment',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CommentEditPage);

import clsx from 'clsx';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import Loading from './Loading';
const addUserSchema = yup.object({
  name: yup.string().required('Name is required'),
  msg: yup.string().required('Message is required'),
});
const GroupForm = ({ tab }: { tab: 'create' | 'join' }) => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: '',
    msg: `Xin chào, mình là. Rất vui được làm quen với bạn. Hãy phản hồi mình nhé!`,
  };
  const formik = useFormik({
    initialValues,
    validationSchema: addUserSchema,
    onSubmit: (values) => {},
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full max-w-lg mx-auto p-5 bg-white rounded-sm flex flex-col gap-4">
          {/**input add user */}
          <div className="rounded">
            <input
              type="text"
              placeholder="Enter name to contact..."
              className="w-full outline-[#4aa8f4] outline-[0.6px] h-[50px] border-[0.6px] border-[#d9d9d9]  py-1 h-full px-4"
              onChange={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
            />
            <p className="text-rose-500 text-sm ps-3">
              {formik.touched.name && formik.errors.name}
            </p>
          </div>
          {/* end input add user */}
          {/* input msg send to user */}
          <div className=" rounded ">
            <textarea
              placeholder="Enter greeting..."
              className="w-full outline-[#4aa8f4] max-h-[200px] min-h-[70px] outline-[0.6px] border-[0.6px] border-[#d9d9d9]  py-1 h-full px-4"
              onChange={formik.handleChange('msg')}
              onBlur={formik.handleBlur('msg')}
              value={formik.values.msg}
            ></textarea>
            <p className="text-rose-500 text-sm ps-3">
              {formik.touched.msg && formik.errors.msg}
            </p>
          </div>
          <button
            type="submit"
            className={clsx(
              'outline-none border-none bg-[#00ACB4] rounded  text-white px-5 py-3 font-bold ms-auto ',
              loading && 'opacity-70 cursor-default'
            )}
          >
            {loading && <Loading />}
            {!loading && 'Send greeting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;

import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { useState , useEffect} from "react";
import userApi from "../api/modules/user.api";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { useSelector } from "react-redux";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import PaymentIcon from '@mui/icons-material/Payment';

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);
  const [onSubscribe, setOnSubscribe] = useState(false);
  const { user } = useSelector((state) => state.user);
 

  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      newPassword: Yup.string()
        .min(8, "newPassword minimum 8 characters")
        .required("newPassword is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "confirmNewPassword not match")
        .min(8, "confirmNewPassword minimum 8 characters")
        .required("confirmNewPassword is required")
    }),
    onSubmit: async values => onUpdate(values), 
    
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await userApi.passwordUpdate(values);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Update password success! Please re-login");
    }
  };

  const onUpdate2 = async (values) => {
    if (onSubscribe) return;
    setOnSubscribe(true);    
    console.log(user.subscription)
    if(user.subscription === "free" ){
     
      const { response, err } = await userApi.subscribe();
      setOnSubscribe(false);

      if (err) toast.error(err.message);
      if (response) {
        form.resetForm();
        navigate("/");
        dispatch(setUser(null));
        dispatch(setAuthModalOpen(true));
        toast.success("subcribe successfull Please re-login");
      }
      
    }
    else if(user.subscription === "premium"){
      
      const { response, err } = await userApi.unsubscribe();
      setOnSubscribe(false);

      if (err) toast.error(err.message);
      if (response) {
        form.resetForm();
        navigate("/");
        dispatch(setUser(null));
        dispatch(setAuthModalOpen(true));
        toast.success("unsubcribed Please re-login");
      }
    }

    
  }
  

    const onUpdate3 = async (values) => {
        const { response, err } = await userApi.pay();
        if (err) toast.error(err.message);
        if (response) {
          form.resetForm();
          navigate("/");
          dispatch(setUser(null));
          dispatch(setAuthModalOpen(true));
          toast.success("Payment complete relogin");
        }

        
  };

  const reload = () =>{

    window.location.reload()
  }

  return (
    
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      
      <Container header="update password">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              placeholder="password"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={form.touched.password && form.errors.password !== undefined}
              helperText={form.touched.password && form.errors.password}
            />
            <TextField
              type="password"
              placeholder="new password"
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.newPassword && form.errors.newPassword !== undefined}
              helperText={form.touched.newPassword && form.errors.newPassword}
            />
            <TextField
              type="password"
              placeholder="confirm new password"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.confirmNewPassword && form.errors.confirmNewPassword !== undefined}
              helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              update password
            </LoadingButton>

           
          </Stack>
        </Box>
      </Container>

      <Container header="Subscription">
        <h1>{user.subscription}</h1>
        <Box maxWidth="400px" >
          <Stack spacing={2}>
           

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onSubscribe}
              onClick={onUpdate2}
            >
              {
                user.subscription === "premium" ? "Unsubcribe":"Subscribe" 


              }            
              
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onSubscribe}
              onClick={onUpdate3}
            >
              <PaymentIcon/>
            </LoadingButton>

           

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              
              onClick={ reload }
            >
             
                Show subcription Status
            </LoadingButton>

          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdate;
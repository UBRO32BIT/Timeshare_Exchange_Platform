import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import IconButton from "@mui/joy/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";
import Button from "@mui/joy/Button";
import * as React from "react";
import { useSelector } from "react-redux";
import { ChangeEvent } from "react";
import { ChangePassword, UpdateUser, SendEmailVerification } from "../../services/auth.service";
import { DialogContent, DialogTitle, FormHelperText, Grid, Modal, ModalClose, ModalDialog, styled } from "@mui/joy";
import { useSnackbar } from 'notistack';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ValidationError } from "yup";
import { InfoOutlined } from "@mui/icons-material";
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
const schema = yup.object().shape({
    firstname: yup.string()
        .required("First Name is required!")
        .matches(/^[a-zA-Z]+$/, 'Field cannot have numeric or special characters'),
    lastname: yup.string()
        .required("Last Name is required!")
        .matches(/^[a-zA-Z]+$/, 'Field cannot have numeric or special characters'),
    email: yup.string()
        .required("Email is required!")
        .email("Email is invalid!"),
    phone: yup.string()
})
const passwordSchema = yup.object().shape({
    currentPassword: yup.string()
        .required("Current password is required!"),
    newPassword: yup.string()
        .required("Password is required!")
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[*@!#%&()^~{}]+/, 'Password must have at least one special character!')
        .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter'),
    repeatPassword: yup.string()
        .required("Repeat password is required!")
        .oneOf([yup.ref('newPassword'), ''], 'Passwords must match'),
})

export default function UserSetting() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const isAuthenticated = useSelector((state: RootState) => state?.auth?.isAuthenticated);
    const [selectedImage, setSelectedImage] = React.useState<any>(null);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [open, setOpen] = React.useState<boolean>(false);
    const [emailVerifyOpen, setEmailVerifyOpen] = React.useState<boolean>(false);
    const [uploading, setUploading] = React.useState<boolean>();
    const { enqueueSnackbar } = useSnackbar();
    React.useEffect(() => {
        setIsLoaded(false);
        if (user) {
            setFormData({
                firstname: user?.firstname,
                lastname: user?.lastname,
                email: user?.email,
                phone: user?.phone,
            })
            if (user?.profilePicture) {
                setSelectedImage(user?.profilePicture)
            }
        }
        console.log(user);
        setIsLoaded(true);
    }, [user, isAuthenticated === true])
    const verifyEmail = () => {
        SendEmailVerification();
        setEmailVerifyOpen(true);
    }
    const handleUpdateUser = async (e: any) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('firstname', e.firstname);
            formData.append('lastname', e.lastname);
            formData.append('email', e.email);
            formData.append('phone', e.phone);
            if (selectedImage instanceof File) {
                formData.append('profilePicture', selectedImage);
            }
            console.log(formData);
            const result = await UpdateUser(user._id, formData);
            if (result) {
                setUploading(false)
                enqueueSnackbar("Updated successully", { variant: "success" });
            }
        }
        catch (error) {
            if (error instanceof ValidationError) {
                console.log(error.inner)
                error.inner.forEach((err) => {
                    enqueueSnackbar(err.message, { variant: "error" });
                });
                //enqueueSnackbar(error.inner[0].message, { variant: "error" });
            } else {
                enqueueSnackbar(`Error while updating information: ${error}`, { variant: "error" });
            }
        }
        //window.location.reload();
    }
    const handlePasswordChange = async (e: any) => {
        console.log(e);
        const data = {
            oldPassword: e.currentPassword,
            newPassword: e.newPassword,
            repeatPassword: e.repeatPassword,
        }
        try {
            const result = await ChangePassword(data);
            //Close the input tab
            setOpen(false);
            //Print success message
            enqueueSnackbar(`${result.message}`, { variant: "success" });
        }
        catch (error) {
            enqueueSnackbar(`Error while changing password: ${error}`, { variant: "error" });
        }
    }
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    })
    const {
        register: registerChangePassword,
        handleSubmit: handlePasswordChangeSubmit,
        formState: { errors: passwordChangeErrors }
    } = useForm({
        resolver: yupResolver(passwordSchema),
    })

    return (
        <Grid container>
            <Grid lg={8} >
                <Stack
                    sx={{
                        display: 'flex',
                        // mx: 'auto',
                        px: { xs: 2, md: 6 },
                        py: { xs: 2, md: 3 },
                    }}
                >
                    {isLoaded && (
                        <Card>
                            <Box sx={{ mb: 1 }}>
                                <Typography level="title-md">Personal info</Typography>
                                <Typography level="body-sm">
                                    Customize how your profile information will appear to the networks.
                                </Typography>
                            </Box>
                            <Divider />
                            <Stack
                                direction="row"
                                spacing={3}
                                sx={{ display: { xs: '12', md: 'flex' }, my: 1 }}
                            >
                                <Stack direction="column" spacing={1}>
                                    <AspectRatio
                                        ratio="1"
                                        maxHeight={200}
                                        sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
                                    >
                                        {selectedImage && (
                                            <img
                                                src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
                                                loading="lazy"
                                                alt=""
                                            />
                                        )}
                                        {!selectedImage && <img
                                            src=''
                                            loading="lazy"
                                            alt=""
                                        />}
                                    </AspectRatio>
                                    <IconButton
                                        component="label"
                                        aria-label="upload new picture"
                                        size="sm"
                                        variant="outlined"
                                        color="neutral"
                                        sx={{
                                            bgcolor: 'background.body',
                                            position: 'absolute',
                                            zIndex: 2,
                                            borderRadius: '50%',
                                            left: 100,
                                            top: 170,
                                            boxShadow: 'sm',
                                        }}
                                    ><VisuallyHiddenInput type="file" onChange={(e) => {
                                        //console.log('update image');
                                        if (e?.target?.files) {
                                            //console.log(e.target.files[0])
                                            setSelectedImage(e?.target?.files[0]);
                                        }

                                    }} />
                                        <EditRoundedIcon />
                                    </IconButton>
                                </Stack>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Stack spacing={1}>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 1 }}
                                        >
                                            <form onSubmit={handleSubmit(handleUpdateUser)}>
                                                <FormLabel>First name</FormLabel>
                                                <Input
                                                    size="sm"
                                                    placeholder="First name"
                                                    {...register('firstname')}
                                                    defaultValue={formData.firstname}
                                                />
                                                {errors.firstname && <p>{errors.firstname.message}</p>}
                                                <FormLabel sx={{ mt: 2 }}>Last name</FormLabel>
                                                <Input
                                                    size="sm"
                                                    placeholder="Last name"
                                                    defaultValue={formData.lastname}
                                                    {...register('lastname')}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {errors.lastname && <p>{errors.lastname.message}</p>}
                                                <FormLabel sx={{ mt: 2 }}>Email</FormLabel>
                                                <Input
                                                    size="sm"
                                                    type="email"
                                                    startDecorator={<EmailRoundedIcon />}
                                                    placeholder="email"
                                                    defaultValue={formData.email}
                                                    {...register('email')}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {errors.email && <p>{errors.email.message}</p>}
                                                <FormLabel sx={{ mt: 2 }}>Phone</FormLabel>
                                                <Input
                                                    size="sm"
                                                    placeholder="Phone"
                                                    {...register('phone')}
                                                    defaultValue={formData.phone}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {/* Add more form fields as needed */}
                                                {/* <CountrySelector
                                                value={formData.country}
                                                onChange={handleInputChange} /> */}
                                                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
                                                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                                                        <Button size="sm" variant="outlined" color="neutral">
                                                            Cancel
                                                        </Button>
                                                        {uploading ? (<Button loading size="sm" variant="solid" type='submit'>
                                                            Save
                                                        </Button>) : <Button size="sm" variant="solid" type='submit'>
                                                            Save
                                                        </Button>}
                                                    </CardActions>
                                                </CardOverflow>
                                            </form>
                                        </FormControl>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Card>
                    )}
                </Stack>
            </Grid>
            <Grid xs={8} lg={3}>
                <Stack sx={{
                    py: { xs: 2, md: 3 },
                    px: { md: 3 }
                }}>
                    <Card>
                        <Box sx={{ mb: 1 }}>
                            <Grid container spacing={3}>
                                <Grid xs={12}>
                                    <Typography level="title-md">Your email</Typography>
                                    <Typography level="body-md">{user?.email}</Typography>
                                    {user.emailVerified ?
                                        <Typography level="body-sm"
                                            sx={{ display: 'inline-flex', gap: 1 }}>
                                            Verified
                                            <VerifiedOutlinedIcon color='success' />
                                        </Typography>
                                        :
                                        <>
                                            <Typography level="body-sm">
                                                Your email is not verified
                                            </Typography>
                                            <Button size="sm" color='success' onClick={verifyEmail}>Verify</Button>
                                            <Modal open={emailVerifyOpen} onClose={() => setEmailVerifyOpen(false)}>
                                                <ModalDialog>
                                                    <ModalClose />
                                                    <DialogTitle>Email sent</DialogTitle>
                                                    <Typography>Please check your mailbox and follow the instruction!</Typography>
                                                </ModalDialog>
                                            </Modal>
                                        </>
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                    <Stack sx={{
                        py: { xs: 2, md: 3 },
                    }}>
                        <Card>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <Typography level="title-md">Authentication</Typography>
                                        <Divider orientation="horizontal" />
                                        <Button sx={{mt:{xs: 1}}} size="md" variant={'solid'} color="primary" onClick={() => setOpen(true)}>
                                            Change password
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Stack>
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <ModalDialog>
                            <ModalClose />
                            <DialogTitle>Change my password</DialogTitle>
                            <DialogContent>Fill in the information to change password.</DialogContent>
                            <form onSubmit={handlePasswordChangeSubmit(handlePasswordChange)}>
                                <Stack spacing={2}>
                                    <FormControl error={!!passwordChangeErrors.currentPassword}>
                                        <FormLabel>Current password</FormLabel>
                                        <Input type='password' {...registerChangePassword('currentPassword')} />
                                        {passwordChangeErrors.currentPassword &&
                                            <FormHelperText>
                                                <InfoOutlined />
                                                {passwordChangeErrors.currentPassword.message}
                                            </FormHelperText>
                                        }
                                    </FormControl>
                                    <FormControl error={!!passwordChangeErrors.newPassword}>
                                        <FormLabel>New password</FormLabel>
                                        <Input type='password' {...registerChangePassword('newPassword')} />
                                        {passwordChangeErrors.newPassword &&
                                            <FormHelperText>
                                                <InfoOutlined />
                                                {passwordChangeErrors.newPassword.message}
                                            </FormHelperText>
                                        }
                                    </FormControl>
                                    <FormControl error={!!passwordChangeErrors.repeatPassword}>
                                        <FormLabel>Repeat password</FormLabel>
                                        <Input type='password' {...registerChangePassword('repeatPassword')} />
                                        {passwordChangeErrors.repeatPassword &&
                                            <FormHelperText>
                                                <InfoOutlined />
                                                {passwordChangeErrors.repeatPassword.message}
                                            </FormHelperText>
                                        }
                                    </FormControl>
                                    <Button type="submit">Submit</Button>
                                </Stack>
                            </form>
                        </ModalDialog>
                    </Modal>
                </Stack>
            </Grid>
        </Grid>
    )
}

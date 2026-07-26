import {useState} from 'react';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Container,
    Alert,
    Stack,
    Anchor,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {notifications} from '@mantine/notifications';
import {IconAlertCircle} from '@tabler/icons-react';
import {supabase} from "../../database/database.connection.ts";

interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginLayout({onSuccess}: LoginFormProps) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Initialize Mantine Form with validation rules
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email format'),
            password: (value) =>
                value.length >= 6 ? null : 'Password must be at least 6 characters',
        },
    });

    // Form submission handler
    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                setErrorMessage(error.message);
            } else if (data.session) {
                notifications.show({
                    title: 'Welcome back!',
                    message: 'You have successfully logged in.',
                    color: 'green',
                });

                // Trigger optional callback (e.g., router redirect or modal close)
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (err: any) {
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" fw={700}>
                Sign in to your account
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {errorMessage && (
                            <Alert
                                icon={<IconAlertCircle size={16}/>}
                                title="Authentication Error"
                                color="red"
                                variant="light"
                                withCloseButton
                                onClose={() => setErrorMessage(null)}
                            >
                                {errorMessage}
                            </Alert>
                        )}

                        <TextInput
                            label="Email"
                            placeholder="you@example.com"
                            required
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            required
                            {...form.getInputProps('password')}
                        />

                        <Button type="submit" fullWidth loading={loading} mt="md">
                            Sign in
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
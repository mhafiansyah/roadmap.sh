import { Form } from "react-router"

export const LoginPage = () => {
    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
            <Form method="post">
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email" style={{ display: 'block' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password" style={{ display: 'block' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ padding: '0.5rem 1rem'}}
                    >
                        Sign In
                    </button>
                </Form>
        </div>
    )
}
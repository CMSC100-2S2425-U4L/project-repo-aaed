import needle from 'needle';

async function createAdminUser() {
    try {
        const data = {
            firstName: 'Admin',
            middleName: 'Test',
            lastName: 'User',
            userType: 'admin',
            email: 'admin@example.com',
            password: 'AdminPassword123',
            confirmPassword: 'AdminPassword123'
        };
        needle.post('http://localhost:3000/auth/register', data, { json: true }, (err, resp, body) => {
            if (err) {
                console.error('Error:', err.message);
            } else if (resp.statusCode >= 400) {
                console.error('Error:', body);
            } else {
                console.log('Admin user created:', body);
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

createAdminUser();

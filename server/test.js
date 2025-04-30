import needle from 'needle';

needle.post(
    'http://localhost:3000/auth/register',
    {
        firstName: "Adrian Jericho",
        middleName: "Tagel",
        lastName: "Javier",
        userType: "customer",
        email: "atjavier1@up.edu.ph",
        password: "password123",
    },
    { json: true }, // Ensure the request is sent as JSON
    (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log(res.body);
        }
    }
);
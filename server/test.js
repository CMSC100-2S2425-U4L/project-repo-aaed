import needle from 'needle';

needle.post(
    'http://localhost:3001/product/add',
    {
        productName: "Ewan",
        productPrice: 100,
        productDescription: "Test",
        productType: 2,
        productQuantity: 10,
        productImage: "test.jpg"

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

needle.post(
    'http://localhost:3001/auth/register',
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
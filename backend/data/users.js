import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Michael Shlezinger',
        email: 'michael@gmail.com',
        password: bcrypt.hashSync('654321', 10),
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),

    }
]

export default users
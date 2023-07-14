import { useState, useEffect } from 'react';

import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, styled, Button,Stack } from '@mui/material';

import axios from 'axios';

const Component = styled(Box)`
    width: 90%;
    margin: 50px auto;
    & > h4 {
        margin-bottom: 20px;
    }
    & > div > table > thead {
        background-color: #212529;
        border-radius:10px;
    }
    & > div > table > thead > tr > th {
        color: #2ec4b6;
        font-size: 17px;
        font-weight: 600;
    }
    & > div > table > tbody > tr > td {
        font-size: 16px;
    }
`;

const Users = () => {

    const [users, setUsers] = useState([]);
    const [state, setState] = useState({
        "userId":0,
        "name":"",
        "email":"",
        "phone":0,
        "salary":0,
        "age":0
    })

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(API_URL);
            const UserData = response.data.Items;
            UserData.reverse();
            setUsers(UserData);
            console.log(response);
        }
        getData();
    }, [])

    const removeEntry = (id) => {
        try {
            const body =  {"id":id };
            console.log(body)
            const deleteData = async () => {
                const response = await axios.delete(`${API_URL}?data=${JSON.stringify(body)}`);
                console.log(response);
            }
            deleteData();
        } catch (error) {
            console.log(error);
        }
        const updatedUsers = users.filter(user => user.userId!== id);
        console.log(updatedUsers)
        setUsers(updatedUsers);
    }
    const update = event => {
        const target = event.currentTarget

        setState({
            ...state,
            [target.name]: target.value
        })
    }

    const handleSubmit = event => {
        event.preventDefault()
        const body = {
            "userId": parseInt(state.userId),
            "name": state.name,
            "email": state.email,
            "phone": parseInt(state.phone),
            "salary": parseInt(state.salary),
            "age": parseInt(state.age),
        }
        console.log(typeof(body))
        try {
            const addEntry = async()=>{
                const response = await axios.post(API_URL,body)
                if(response.status===200){
                    window.location.reload();
                }
                console.log(response);
            }
            addEntry();
        } catch (error) {
            console.log(error)   
        }
        console.log(state)
    }
    return (
        <Stack direction='column' sx={{height:'100%'}}>
        <Component >
            <Stack direction="row" sx={{height:'100%',padding:'0.5rem',display: "flex"}} >
                <Typography variant="h4" sx={{alignItems:'center'}}>Employees</Typography>
            </Stack>
            <Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.salary}</TableCell>
                                    <TableCell>{user.age}</TableCell>
                                    <TableCell><Button variant="contained" color="error" onClick={() => removeEntry(user.userId)}>Delete</Button></TableCell>
                                    <TableCell><Button variant="contained" color="success">Edit</Button></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <form onSubmit={handleSubmit}>
                    <input
                    type="number"
                    name="userId"
                    placeholder='Employee Id'
                    onChange={update}
                    style={{borderRadius:'5px',borderColor:'black',fontSize:'16px',width:'11%',margin:'1%'}}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder='Name'
                        onChange={update}
                        style={{borderRadius:'5px',borderColor:'black',fontSize:'16px',width:'11%',margin:'1%'}}
                    />
                    <input
                    type="text"
                    name="email"
                    placeholder='Email'
                    onChange={update}
                    style={{borderRadius:'5px',borderColor:'black',fontSize:'16px',width:'11%',margin:'1%'}}
                    />
                    <input
                        type="number"
                        name="phone"
                        placeholder='Phone'
                        onChange={update}
                        style={{borderRadius:'5px',borderColor:'black',fontSize:'16px',width:'11%',margin:'1%'}}
                    />
                    <input
                        type="number"
                        name="salary"
                        placeholder='Salary'
                        onChange={update}   
                        style={{borderRadius:'5px',borderColor:'black',fontSize:'16px',width:'11%',margin:'1%'}}
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder='Age'
                        onChange={update}
                        style={{borderRadius:'5px',borderColor:'black',fontSize:'16px',width:'11%',margin:'1%'}}     
                    />
                    <Button variant="contained"  type="submit" color="success" sx={{width:'13%',fontSize:'11px'}} >Add Employee</Button>
                </form>
            </Box>
        </Component>
        </Stack>
    )
}

export default Users;
import { getAllUsers } from '../controllers/usersControllers';

test('get an array of all users stored in database', async () => {
    const result = await getAllUsers()
    expect(result).toEqual(array);
})

test('Check if the user exists', async () => {
    const result = await checkUser();
    expect(result).toEqual(obj); 
})

test('Check if the user exists', async () => {
    const result = await addUser();
    expect(result).toEqual(obj); 
})

test('Check if the user exists', async () => {
    const result = await apagarUser();
    expect(result).toEqual(obj); 
})

test('Check if the user exists', async () => {
    const result = await getSessaoInscritasByUser();
    expect(result).toEqual(obj); 
})
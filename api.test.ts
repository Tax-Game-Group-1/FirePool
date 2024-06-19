import request from 'supertest';
import express from 'express';
import {setUpServer} from "./api";

const app = express();
app.use(express.json());
setUpServer(app);

describe('Admin API Endpoints', () => {
    describe('POST /adminLogin', () => {
        it('should return 400 if username is missing', async () => {
            const res = await request(app)
                .post('/adminLogin')
                .send({ password: 'password' });
    
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'Username is missing',
            });
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app)
                .post('/adminLogin')
                .send({ username: 'admin' });
      
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'Password is missing',
            });
        });

        it('should return 200 and admin ID if credentials are correct', async () => {
            const i = 1; // Replace with an actual ID you expect
            jest.mock('../path/to/queries/queries', () => ({
              getAdminIdByUserName: jest.fn().mockResolvedValue(i),
            }));
      
            const res = await request(app)
              .post('/adminLogin')
              .send({ username: 'admin', password: 'password' });
      
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
              success: true,
              data: {
                id: i,
              },
            });
        });

        it('should return 201 and error message if credentials are incorrect', async () => {
            const mockError = 'Invalid credentials';
            jest.mock('../path/to/queries/queries', () => ({
              getAdminIdByUserName: jest.fn().mockRejectedValue(mockError),
            }));
      
            const res = await request(app)
              .post('/adminLogin')
              .send({ username: 'admin', password: 'wrongpassword' });
      
            expect(res.status).toBe(201);
            expect(res.body).toEqual({
              success: false,
              message: mockError,
            });
          });
    });

    describe('POST /adminSignup', () => {
        it('should return 400 if username is missing', async () => {
          const res = await request(app)
            .post('/adminSignup')
            .send({ email: 'admin@example.com', password: 'password' });
    
          expect(res.status).toBe(400);
          expect(res.body).toEqual({
            success: false,
            message: 'Username is missing',
          });
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app)
              .post('/adminSignup')
              .send({ username: 'admin', email: 'admin@example.com' });
      
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
              success: false,
              message: 'Password is missing',
            });
        });

        it('should return 400 if email is missing', async () => {
            const res = await request(app)
              .post('/adminSignup')
              .send({ username: 'admin', password: 'password' });
      
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
              success: false,
              message: 'Email is missing',
            });
        });

        it('should return 201 and admin ID if signup is successful', async () => {
            const mockAdminId = 1; // Replace with an actual ID you expect
            jest.mock('../path/to/queries/queries', () => ({
              createAdminUser: jest.fn().mockResolvedValue(mockAdminId),
            }));
      
            const res = await request(app)
              .post('/adminSignup')
              .send({
                username: 'admin',
                email: 'admin@example.com',
                password: 'password',
              });
      
            expect(res.status).toBe(201);
            expect(res.body).toEqual({
              success: true,
              message: 'Created user',
              data: {
                id: mockAdminId,
              },
            });
        });

        it('should return 500 and error message if user already exists', async () => {
            const mockError = 'User already exists, please log in';
            jest.mock('../path/to/queries/queries', () => ({
              createAdminUser: jest.fn().mockRejectedValue(mockError),
            }));
      
            const res = await request(app)
              .post('/adminSignup')
              .send({
                username: 'admin',
                email: 'admin@example.com',
                password: 'password',
              });
      
            expect(res.status).toBe(500);
            expect(res.body).toEqual({
              success: false,
              message: mockError,
            });
        });

    });
});

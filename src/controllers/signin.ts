import { AuthModel } from '@auth/models/auth.schema';
import { loginSchema } from '@auth/schemes/signin';
import { getUserByEmail, getUserByUsername, signToken } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, isEmail } from '@Fallda1/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';
// import { publishDirectMessage } from '@auth/queues/auth.producer';
// import { authChannel } from '@auth/server';

export async function read(req: Request, res: Response): Promise<void> {
    const { error } = await Promise.resolve(loginSchema.validate(req.body));
    if (error?.details) {
        throw new BadRequestError(error.details[0].message, 'SignIn read() method error');
    }
    const { username, password } = req.body;//not sure about browserName, deviceType
    const isValidEmail: boolean = isEmail(username);
    const existingUser: IAuthDocument | undefined = !isValidEmail ? await getUserByUsername(username) : await getUserByEmail(username);
    if (!existingUser) {
        throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
    }
    const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(password, `${existingUser.password}`);
    if (!passwordsMatch) {
        throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
    }
    // let userJWT = '';
    // let userData: IAuthDocument | null = null;
    const userJWT: string = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
    const userData: IAuthDocument = omit(existingUser, ['password']);
    // let message = 'User login successfully';
    // let userBrowserName = '';
    // let userDeviceType = '';
    // if (browserName !== existingUser.browserName || deviceType !== existingUser.deviceType) {
    //     // min 6 digits and max 6 digits
    //     // 100000 - 999999
    //     // send email with otp
    //     const messageDetails: IEmailMessageDetails = {
    //         receiverEmail: existingUser.email,
    //         username: existingUser.username,
    //         template: 'otpEmail'
    //     };
    //     await publishDirectMessage(
    //         authChannel,
    //         'jobber-email-notification',
    //         'auth-email',
    //         JSON.stringify(messageDetails),
    //         'OTP email message sent to notification service.'
    //     );
    //     message = 'OTP code sent';
    //     userBrowserName = `${existingUser.browserName}`;
    //     userDeviceType = `${existingUser.deviceType}`;
    //     const date: Date = new Date();
    //     date.setMinutes(date.getMinutes() + 10);
    // } else {
    //     userJWT = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
    //     userData = omit(existingUser, ['password']);
    // }
    res.status(StatusCodes.OK).json({ message: 'User Login successfully', user: userData, token: userJWT }); //, browserName: userBrowserName, deviceType: userDeviceType 
}

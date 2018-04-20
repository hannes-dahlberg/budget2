import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export let toJson = (object: any): JSON => {
    return JSON.parse(JSON.stringify(object));
}

export let hash = (plainText: string): string => {
    return bcrypt.hashSync(plainText, 10);
}
export let hashCheck = (plainText: string, hash: string) => {
    return bcrypt.compareSync(plainText, hash);
}

export let signJwt = (payload: any): string => {
    return jwt.sign(payload, 'EBdVaKyseI');
}
export let decodeJwt = (token: string): any => {
    return jwt.verify(token, 'EBdVaKyseI');
}
export let verifyJwt = (token: string): boolean => {
    return !!decodeJwt(token);
}
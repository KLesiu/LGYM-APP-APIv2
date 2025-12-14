import { customAlphabet } from "nanoid";
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const generateCode = customAlphabet(alphabet, 5);

export default generateCode
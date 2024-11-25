import { GymForm } from "../interfaces/Gym";
import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import Gym, { GymEntity } from "../models/Gym";
import { Request, Response } from "express";
import User from "../models/User";
import { Message } from "../enums/Message";



const addGym = async (req:Request<Params,{},GymForm>,res:Response<ResponseMessage>)=>{
    const user = await User.findById(req.params.id);
    if(!user || !Object.keys(user).length) return res.status(404).send({msg: Message.DidntFind});
    const gym = {
        ...req.body,
        user: user._id
    }
    await Gym.create(gym);
    return res.status(200).send({msg: Message.Created});
}

const deleteGym = async (req:Request<Params,{},{}>,res:Response<ResponseMessage>)=>{
    if(!req.params.id) return res.status(400).send({msg: Message.FieldRequired});
    await Gym.findByIdAndDelete(req.params.id);
    return res.status(200).send({msg: Message.Deleted});
}

const getGyms = async (req:Request<Params,{}>,res:Response<GymForm[] | ResponseMessage>)=>{
    const user = await User.findById(req.params.id);
    if(!user || !Object.keys(user).length) return res.status(404).send({msg: Message.DidntFind});
    const gyms = await Gym.find({user: user._id});

    const gymsWithotUser = gyms.map(gym=>{
        return{
            _id: gym._id,
            name: gym.name,
            address: gym.address
        }
    })
    
    return res.status(200).send(gymsWithotUser);
}

const getGym = async (req:Request<Params,{},{}>,res:Response<GymForm | ResponseMessage>)=>{
    if(!req.params.id) return res.status(400).send({msg: Message.FieldRequired});
    const gym = await Gym.findById(req.params.id);
    if(!gym) return res.status(404).send({msg: Message.DidntFind});
    const gymWithoutUser = {
        _id: gym._id,
        name: gym.name,
        address: gym.address
    }
    return res.status(200).send(gymWithoutUser);
}

const editGym = async (req:Request<{},{},GymForm>,res:Response<ResponseMessage>)=>{
    if(!req.body._id) return res.status(400).send({msg: Message.FieldRequired});
    await Gym.findByIdAndUpdate(req.body._id,req.body);
    return res.status(200).send({msg: Message.Updated});
}




export {addGym,deleteGym,getGyms,getGym,editGym}
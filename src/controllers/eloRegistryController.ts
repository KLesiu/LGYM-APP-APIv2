import { Message } from "../enums/Message";
import { EloRegistryBaseChart } from "../interfaces/EloRegistry";
import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import EloRegistry from "../models/EloRegistry";
import User from "../models/User";
import { Response,Request } from "express";

const getEloRegistry = async (
    req: Request<Params, {}, {}>,
    res: Response<EloRegistryBaseChart[] | ResponseMessage>
  ) => {
    const user = await User.findById(req.params.id);
    if (!user || !Object.keys(user).length)
      return res.status(404).send({ msg: Message.DidntFind });
  
    const eloRegistry = await EloRegistry.find({ user: user._id }).sort({
      date: 1,
    });
  
    const options: Intl.DateTimeFormatOptions = { month: "2-digit", day: "2-digit" };
  
    const eloRegistryBaseChart: EloRegistryBaseChart[] = eloRegistry.map((elo) => ({
      _id: elo._id,
      value: elo.elo,
      date: new Intl.DateTimeFormat("en-US", options).format(new Date(elo.date)),
    }));
  
    if (eloRegistry.length > 0) return res.status(200).send(eloRegistryBaseChart);
    else return res.status(404).send({ msg: Message.DidntFind });
  };
  
  export { getEloRegistry };
  
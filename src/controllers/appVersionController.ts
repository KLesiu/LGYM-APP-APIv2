import { Response, Request } from "express";
import { Platforms } from "../enums/Platforms";
import {
  AppConfigInfo,
  AppConfigInfoWithPlatform,
} from "../interfaces/AppConfigInfo";
import { Message } from "../enums/Message";
import ResponseMessage from "../interfaces/ResponseMessage";
import AppConfig from "../models/AppConfig";
import Params from "../interfaces/Params";
import User from "../models/User";

const getAppVersion = async (
  req: Request<{}, {}, { platform: Platforms }>,
  res: Response<AppConfigInfo | ResponseMessage>
) => {
  const { platform } = req.body;
  if (!platform || !Object.values(Platforms).includes(platform)) {
    return res.status(404).send({ msg: Message.DidntFind });
  }
  const appConfig = await AppConfig.findOne(
    {
      platform,
    },
    {
      minRequiredVersion: 1,
      latestVersion: 1,
      forceUpdate: 1,
      updateUrl: 1,
      releaseNotes: 1,
      _id: 0,
    }
  )
    .sort({ createdAt: -1 })
    .lean();
  if (!appConfig || !Object.keys(appConfig).length) {
    return res.status(404).send({ msg: Message.DidntFind });
  }
  return res.status(200).send(appConfig);
};

const createNewAppVersion = async (
  req: Request<Params, {}, AppConfigInfoWithPlatform>,
  res: Response<ResponseMessage>
) => {
  const user = await User.findById(req.params.id);
  if (!user || !user.admin) {
    return res.status(403).send({ msg: Message.Forbidden });
  }

  if (!req.body || !Object.keys(req.body).length) {
    return res.status(400).send({ msg: Message.FieldRequired });
  }
  const newAppConfig = new AppConfig(req.body);
  await newAppConfig.save();
  return res.status(201).send({ msg: Message.Created });
};

export { getAppVersion, createNewAppVersion };

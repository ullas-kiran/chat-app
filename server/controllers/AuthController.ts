import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import { AuthBody, LoginResponse, SignupResponse, TokenPayload } from "../types";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge: number = 3 * 24 * 60 * 60 * 1000;
const createToken = ({ email, userId }: TokenPayload) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY as string, {
    expiresIn: maxAge,
  });
};

export const signup = async (request: Request,response: Response<SignupResponse|string>,next: NextFunction):Promise<any>  => {
  try {
    const { email, password }: AuthBody = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken({ email: email, userId: user.id }), {
      maxAge,
      secure: true,
      sameSite: "none",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request: Request,response: Response<LoginResponse|string>,next: NextFunction):Promise<any>  => {
  try {
    const { email, password }: AuthBody = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.findOne({ email });
    if(!user){
      return response.status(404).send("User with the given email not found");
    }
    const auth= await compare(password,user.password);

    if(!auth){
      return response.status(400).send("Password is incorrect");
    }
    response.cookie("jwt", createToken({ email: email, userId: user.id }), {
      maxAge,
      secure: true,
      sameSite: "none",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName:user.firstName,
        lastName:user.lastName,
        image:user.image,
        color:user.color
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request: any,response: Response<any>,next: NextFunction):Promise<any>  => {
  try {
    const userData=await User.findById(request.userId);
    if(!userData){
      return response.status(404).send("User with given id not found ")
    }
    return response.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName:userData.firstName,
        lastName:userData.lastName,
        image:userData.image,
        color:userData?.color
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};


export const updateProfile = async (request: any,response: Response<any>,next: NextFunction):Promise<any>  => {
  try {
    const {userId} =request;
    const {firstName,lastName,color} =request.body;
    if(!firstName||!lastName){
      return response.status(400).send("Firstname and lastname and color is required")
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
        id: userData?.id,
        email: userData?.email,
        profileSetup: userData?.profileSetup,
        firstName:userData?.firstName, 
        lastName:userData?.lastName,
        image:userData?.image,
        color:userData?.color
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};


export const addProfileImage = async (request: any,response: Response<any>,next: NextFunction):Promise<any>  => {
  try {
    if(!request.file){
      return response.status(400).send("File is required.")
    }

    const date =Date.now();
    let fileName="uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path,fileName);

    const updatedUser=await User.findByIdAndUpdate(request.userId,{image:fileName},{new:true,runValidators:true})

    return response.status(200).json({
      image:updatedUser?.image
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};


export const removeProfileImage = async (request: any,response: Response<any>,next: NextFunction):Promise<any>  => {
  try {
    const {userId} =request;
    const user=await User.findById(userId)

    if(!user){
      return response.status(404).send("User not found.")
    }

    if(user.image){
      unlinkSync(user.image)
    }

    user.image=null;
    await user.save();

    return response.status(200).send("Profile image removed");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
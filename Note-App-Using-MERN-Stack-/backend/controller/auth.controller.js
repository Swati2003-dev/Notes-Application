import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, resp,next) => {
  const { username, email, password } = req.body;

  const isValidUser= await User.findOne({email})

  if(isValidUser){
    return next(errorHandler(400,"User already exist"))
  }

  const hashedPassword=bcryptjs.hashSync(password,10)

  const newUser=new User({
    username,
    email,
    password:hashedPassword
  })
  try{
    await newUser.save()
    resp.status(201).json({
    success:true,
    message:"User Created Successfully",
    })
  }
  catch(error){
    next(error)
  }
};


export const signin=async(req,res,next)=>{
  const {email,password}=req.body

  try{
    const validUser=await User.findOne({email}) 

    if(!validUser){
      return next(errorHandler(404,"User not found"))
    }
    if(!validUser.password){
      return next(errorHandler(400,"Password not set for this account. Please use 'Forgot Password' to set one."))
    }
    const validPassword=bcryptjs.compareSync(password,validUser.password)

    if(!validPassword){
      return next(errorHandler(401,"Wrong Credentials"))
    }
    const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
    const {password:pass,...userData}=validUser._doc

    res.cookie("access_token",token,{httpOnly:true, secure: true, sameSite: "none"}).status(200).json({
      success:true,
      message:"Login Successfull",
      user: userData
    })
  }catch(error){
    next(error)
  }
}


export const signout=async(req,res,next)=>{
  try{
    res.clearCookie("access_token", {httpOnly: true, secure: true, sameSite: "none"})

    res.status(200).json({
      success:true,
      message:"User logged out successfully"
    })
  }catch(error){
    next(error)
  }
}

import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return next(errorHandler(404, "There is no user with that email address."));
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token to save in DB
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password to: \n${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Notes Application account.</p>
        <p>Please click the button below to reset your password. This link is valid for 15 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" style="background-color: #2B85FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 15 min)",
        message,
        html: htmlMessage,
      });

      res.status(200).json({
        success: true,
        message: "Please check your inbox for the reset link.",
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error("NODEMAILER ERROR:", err);
      return next(errorHandler(500, "There was an error sending the email. Try again later!"));
    }

  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // If token has not expired, and there is a user, set the new password
    if (!user) {
      return next(errorHandler(400, "Token is invalid or has expired"));
    }

    user.password = bcryptjs.hashSync(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    next(error);
  }
};

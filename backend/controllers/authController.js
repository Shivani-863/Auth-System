import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail,sendWelcomeEmail, sendResetPasswordEmail,sendResetPasswordSuccessEmail} from "../nodemailer/emails.js";
export const signup=async(req,res)=>{
    const {email,password,name}=req.body;
    try{
        if(!email || !password || !name){
            throw new Error("All fields requiredd");
        }
    const userAlreadyExists=await User.findOne({email});
    if(userAlreadyExists){
         return res.status(400).json({success:false,message:"User already exists"});
    }

    const hashedPassword=await bcryptjs.hash(password,10);
    const verificationToken=Math.floor(100000+Math.random()*900000).toString();
    const user=new User({
        email,
        password:hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt:Date.now()+24*60*60*1000//24 hours
    })
    await user.save();

    //jwt
    generateTokenAndSetCookie(res,user._id);
    await sendVerificationEmail(user.email,verificationToken);
    res.status(201).json({
        success:true,
        message:"User added successfully",
        user:{
            ...user._doc,
            password:undefined
        }
    })
    }catch(error){
      res.status(400).json({success:false,message:error.message});
    } 
}
export const verifyEmail=async(req,res)=>{
    const {code}=req.body;
    try{
     const user= await User.findOne({
        verificationToken:code,
        verificationTokenExpiresAt:{$gt: Date.now()}
     });
      if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired Veification Code"});
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
        await user.save();
        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({success:true,message:"Success"});
    }catch(err)
    {
       console.log("Error in verifying email...",error);
       res.status(500).json({success:false,message:"Error"});
    }
}
export const login=async(req,res)=>{
    const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "User with provided email does not exist" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid password" });
		}

		generateTokenAndSetCookie(res, user._id);
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
export const logout=async(req,res)=>{
   res.clearCookie("token");
   res.status(200).json({success:true,message:"Cookies deleted successfully"});
}
export const forgotPassword=async(req,res)=>{
    	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
export const resetPassword=async(req,res)=>{
    try {
       const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetPasswordSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        
    }
}

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

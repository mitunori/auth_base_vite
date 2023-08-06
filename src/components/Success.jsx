import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user, "user情報をチェック！");
      //userにはログインor登録されているかの状態がtrue/falseで入ってくるので、!userはfalse＝user情報がないとき!
      !user && navigate("/login");
    });

    return () => unSub();
  }, [navigate]);

  const googleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Success</h1>
      <div>成功した時に表示したい中身を記述してみましょう🤗</div>
      {/* ログアウトのボタン */}
      <button onClick={googleLogOut}>ログアウト</button>
    </div>
  );
};

export default Success;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
// firebaseを使うために用意されているおまじないを読み込む
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Add from "./Add";
import Post from "./Post";

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

  // 08/06ここから下に記述
  //1. useStateを準備して、データを取得できるようにする🤗
  const [data, setData] = useState([
    {
      id: "",
      title: "",
      text: "",
    },
  ]);
  console.log(data, "useStateの箱の中身");

  //3. 登録用のuseStateを準備します🤗
  const [titleValue, setTitleValue] = useState("");
  // 追加したinput用
  const [textValue, setTextValue] = useState("");

  // 2. useEffectを使って画面表示の際にfirebaseからデータを取得する
  useEffect(() => {
    //2.1 query=コレクション(firebaseのデータが入る箱のこと)
    const q = query(collection(db, "posts")); //データにアクセス

    // 2.2
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      setData(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          text: doc.data().text,
        }))
      );
    });
    return () => unsub();
  }, []);

  //4. inputのonChangeのイベントを記述🤗
  const handleTitleChange = (e) => {
    console.log(e, "event");
    console.log(e.target, "event target");
    setTitleValue(e.target.value);
  };

  const handleTextChange = (e) => {
    console.log(e, "event");
    console.log(e.target, "event target");
    setTextValue(e.target.value);
  };

  //5. 送信の処理を記述＝送信のボタンが押されたら登録の処理を実行する🤗
  const addData = async () => {
    // 処理を記述していきます🤗
    // alert(1); 記述後、送信ボタンを押す→画面に変化があればコメントアウトしましょう🤗

    // firebaseへの登録の処理
    await addDoc(
      collection(db, "posts"), //場所どこ？ 今回は[posts]に変更する😊
      {
        title: titleValue,
        text: textValue,
      }
    );

    // 文字を空にします🤗
    setTitleValue("");
    setTextValue("");
  };

  return (
    <div>
      <h1>Success</h1>
      <div>成功した時に表示したい中身を記述してみましょう🤗</div>
      {/* ログアウトのボタン */}
      <button onClick={googleLogOut}>ログアウト</button>
      {/* ここから下記述 */}
      <hr />
      {/* 登録の処理 */}
      <Add
        addData={addData}
        titleValue={titleValue}
        textValue={textValue}
        handleTitleChange={handleTitleChange}
        handleTextChange={handleTextChange}
      />

      <hr />
      {/* 表示のロジック */}
      {data.map((item, index) => (
        <Post
          key={item.id}
          id={item.id}
          editTitle={item.title}
          editText={item.text}
        />
      ))}
    </div>
  );
};

export default Success;

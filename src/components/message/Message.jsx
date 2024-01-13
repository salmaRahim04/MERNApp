import React from "react";
import { format } from "timeago.js";
import { Avatar } from "@material-ui/core";

import './message.css'
export default function Message({ message, own,user }) {
  console.log(user)
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
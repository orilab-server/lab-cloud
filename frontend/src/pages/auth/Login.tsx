import React, { useEffect } from "react";
import "./login.css";

export const Login = () => {
  return (
    <div className="login-form-wrapper">
      <form className="login-form">
        <div className="form-title">Orilab Cloudへログイン</div>
        <div className="input-password-wrapper">
          <label className="password-label">パスワード</label>
          <input id="password" type="text" className="input-password" />
        </div>
        <button type="submit" className="login-button">
          ログイン
        </button>
      </form>
    </div>
  );
};

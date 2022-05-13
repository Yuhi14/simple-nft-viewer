import React, { useState, useEffect } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import css from "./App.module.scss";

export function App() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const { getNFTBalances, data, error } = useNFTBalances();

  const [account, setAccount] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setAccount(user.get("ethAddress"));
      getNFTBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const onClickLogin = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "アカウントに紐づくNFTを表示します。※ガス代は一切かかりません。" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onClickLogout = async () => {
    await logout();
    setAccount("");
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>Simple NFT Viewer</h1>
      </div>

      {isAuthenticated || (
        <div className={css["login-area"]}>
          <button className={css["login-btn"]} onClick={onClickLogin}>
            Login
          </button>
          <p className={css.desc}>所有しているNFTを表示します。</p>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div className={css["account-area"]}>
            <p className={css["wallet-address"]}>{`接続中のウォレット: ${account}`}</p>
            <button className={css["logout-btn"]} onClick={onClickLogout}>
              Logout
            </button>
          </div>

          {data ? (
            <div className={css["nft-list"]}>
              {error && <p className={css.error}>NFTの読み込みに失敗しました。</p>}
              {data.result.map(item => (
                <div className={css["nft-item"]} key={item.token_id}>
                  <div className={css["nft-item__image"]}>
                    <img src={item.metadata.image || data.result[0].metadata.image_url} alt={item.metadata.name} />
                  </div>
                  <h2 className={css["nft-item__name"]}>{item.metadata.name}</h2>
                  <p className={css["nft-item__desc"]}>{item.metadata.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={css.empty}>表示できるNFTがありません。</div>
          )}
        </>
      )}
    </div>
  );
}

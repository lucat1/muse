import * as React from "react";
import { useForm } from "react-hook-form";
import { useConnections, Connection } from "../const";

const salt = (len: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; ++i)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};

type FormFields = Connection & { saltLength: number };
const Welcome = () => {
  const [connections, setConnections] = useConnections();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const onSubmit = ({ id, host, username, password, saltLength }: FormFields) =>
    setConnections([
      ...connections,
      {
        id,
        host,
        username,
        password,
        salt: salt(saltLength),
        // player: { state: "none", song: undefined },
      },
    ]);
  console.log("errors", errors);

  return (
    <>
      <h1>connect</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="url"
          id="host"
          placeholder="Subsonic host URL"
          {...register("host", {
            required: true,
            pattern:
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
          })}
        />
        {errors.host && <label htmlFor="host">invalid host</label>}
        <input
          type="text"
          id="username"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <label htmlFor="username">a password is required</label>
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.username && (
          <label htmlFor="password">a password is required</label>
        )}
        <input
          type="number"
          defaultValue={32}
          placeholder="saltLength"
          {...register("saltLength", { max: 64, min: 6 })}
        />

        <input type="submit" />
      </form>
    </>
  );
};

export default Welcome;

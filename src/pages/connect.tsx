import * as React from "react";
import { useForm } from "react-hook-form";

const Welcome = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
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
        {errors.host && <label for="host">invalid host</label>}
        <input
          type="text"
          placeholder="username"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <label for="username">a password is required</label>
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.username && (
          <label for="password">a password is required</label>
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

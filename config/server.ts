export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  //url: "https://b03b-2804-248-fad7-9b00-9817-ee74-646c-fc10.ngrok-free.app",
});

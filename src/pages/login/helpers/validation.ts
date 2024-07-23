import { z, ZodType } from "zod";

const schema = z.object({
  password: z.string({}),
  username: z.string({
    errorMap: (issue, _ctx) => {
      console.log("issue", issue);
      console.log("_ctx", _ctx);

      return { message: "123" };
    },
  }),
});

type Schema = z.infer<typeof schema>;

const data: Schema = {
  username: "user",
  password: "",
};

const result = schema.safeParse(data);

if (result.success) {
  console.log("result", result.data.username);
} else {
  console.error(result.error);
}

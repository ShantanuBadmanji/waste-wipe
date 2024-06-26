import { z } from "zod";

const CreateUserDto = z.object({
  name: z.string().min(2).max(50),
  emailId: z.string().email().endsWith("gmail.com"),
  password: z.string().min(6),
});

export default CreateUserDto;

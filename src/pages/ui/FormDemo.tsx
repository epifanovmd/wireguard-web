import {
  Button,
  CheckboxFormField,
  Field,
  FormField,
  InputFormField,
  Modal,
  ModalContent,
  SelectFormField,
  SwitchFormField,
} from "@components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, UserPlus } from "lucide-react";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "moderator", label: "Moderator" },
  { value: "viewer", label: "Viewer (read-only)" },
] as const;

type RoleValue = (typeof roleOptions)[number]["value"];

const countryOptions = [
  { value: "ru", label: "Russia" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "gb", label: "United Kingdom" },
  { value: "jp", label: "Japan" },
];

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username must be at most 32 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers and underscores allowed",
      ),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "moderator", "viewer"], {
      required_error: "Please select a role",
    }),
    country: z.string().min(1, "Please select a country"),
    bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
    emailNotifications: z.boolean(),
    acceptTerms: z
      .boolean()
      .refine(v => v === true, "You must accept the terms to continue"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

// ─── Inner form ───────────────────────────────────────────────────────────────

const CreateUserForm = ({
  onSuccess,
}: {
  onSuccess: (username: string) => void;
}) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      country: "",
      bio: "",
      emailNotifications: false,
      acceptTerms: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormData) => {
    await new Promise<void>(r => setTimeout(r, 1200));
    onSuccess(data.username);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4">
        {/* Row 1: username + email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputFormField<FormData>
            name="username"
            label="Username"
            hint="3–32 characters, letters/numbers/underscores only"
            placeholder="john_doe"
            required
          />
          <InputFormField<FormData>
            name="email"
            label="Email address"
            placeholder="john@example.com"
            type="email"
            required
          />
        </div>

        {/* Row 2: passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputFormField<FormData>
            name="password"
            label="Password"
            hint="Min 8 chars, one uppercase letter and one number"
            placeholder="••••••••"
            type="password"
            required
          />
          <InputFormField<FormData>
            name="confirmPassword"
            label="Confirm password"
            placeholder="••••••••"
            type="password"
            required
          />
        </div>

        {/* Row 3: role + country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectFormField<FormData>
            name="role"
            label="Role"
            description="Defines what this user can do"
            placeholder="Select role…"
            required
            options={
              roleOptions as unknown as Array<{
                value: RoleValue;
                label: string;
              }>
            }
          />
          <SelectFormField<FormData>
            name="country"
            label="Country"
            placeholder="Select country…"
            options={countryOptions}
          />
        </div>

        {/* Bio — raw FormField (demonstrates render prop + TName narrowing) */}
        <FormField<FormData, "bio">
          name="bio"
          label="Bio"
          description="Short description, max 200 characters"
          hint="Displayed on the user's public profile"
          render={(field, fieldState) => (
            <textarea
              id="bio"
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              rows={3}
              placeholder="Tell us a bit about yourself…"
              className={[
                "flex w-full rounded-lg px-3 py-2 text-sm transition-all duration-200",
                "placeholder:text-muted-foreground bg-input-background border",
                "focus-visible:outline-none focus-visible:shadow-focus",
                "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                fieldState.invalid
                  ? "border-destructive focus-visible:shadow-focus-error"
                  : "border-border",
              ].join(" ")}
            />
          )}
        />

        <div className="border-t pt-4 flex flex-col gap-3">
          {/* Switch with separate Field label (shows Field as standalone) */}
          <div className="flex items-center justify-between gap-4">
            <Field
              label="Email notifications"
              description="Receive alerts, updates, and weekly digests"
              htmlFor="emailNotifications"
            />
            <SwitchFormField<FormData> name="emailNotifications" />
          </div>

          {/* Checkbox + custom inline label */}
          <div className="flex items-start gap-3">
            <CheckboxFormField<FormData>
              name="acceptTerms"
              fieldClassName="mt-0.5 shrink-0"
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm leading-snug cursor-pointer -mt-0.5"
            >
              I agree to the{" "}
              <span className="text-primary underline underline-offset-2">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary underline underline-offset-2">
                Privacy Policy
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Modal.Close asChild>
            <Button variant="outline" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </Modal.Close>
          <Button
            type="button"
            loading={isSubmitting}
            variant="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Create account
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

// ─── Success state ────────────────────────────────────────────────────────────

const SuccessView = ({
  username,
  onClose,
}: {
  username: string;
  onClose: () => void;
}) => (
  <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
    <div className="rounded-full bg-success/10 p-4">
      <CheckCircle2 className="h-10 w-10 text-success" />
    </div>
    <div>
      <p className="text-lg font-semibold">Account created!</p>
      <p className="text-sm text-muted-foreground mt-1">
        Welcome, <span className="font-medium text-foreground">{username}</span>
        . Your account is ready.
      </p>
    </div>
    <Button variant="primary" onClick={onClose} className="mt-2">
      Done
    </Button>
  </div>
);

// ─── Public component ─────────────────────────────────────────────────────────

export const FormDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [successUser, setSuccessUser] = React.useState<string | null>(null);

  const handleClose = (v: boolean) => {
    setOpen(v);
    if (!v) setTimeout(() => setSuccessUser(null), 200);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <Modal.Trigger asChild>
        <Button variant="primary">
          <UserPlus size={16} className="mr-2" />
          Create user
        </Button>
      </Modal.Trigger>

      <ModalContent
        size="lg"
        disableInteractOutside={!successUser}
        title={successUser ? undefined : "Create new user"}
        description={
          successUser
            ? undefined
            : "Fill in the details below. Fields marked * are required."
        }
        hideCloseButton={!!successUser}
      >
        {successUser ? (
          <SuccessView
            username={successUser}
            onClose={() => handleClose(false)}
          />
        ) : (
          <CreateUserForm onSuccess={setSuccessUser} />
        )}
      </ModalContent>
    </Modal>
  );
};

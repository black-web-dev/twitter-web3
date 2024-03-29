import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import { useCallback, useRef, useState } from "react";

import { BackArrowIcon } from "@/assets/back-arrow-icon";
import { CloseIcon } from "@/assets/close-icon";
import { CloseButton } from "@/components/elements/close-button";
import { TextInput } from "@/components/elements/text-input";

import { updateProfile } from "../api/update-profile";
import { CameraIcon } from "../assets/camera-icon";
import { IProfile, IUser } from "../types";

import { SocialButton } from "./social-button";
import styles from "./styles/edit-profile-modal.module.scss";
import { UsernameSwitch } from "./username-switch";

export const EditProfileModal = ({
  user,
  closeModal,
}: {
  user: IUser;
  closeModal: () => void;
}) => {
  const innerWidth = window.innerWidth;

  const pathname = usePathname();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      profile,
      userId,
    }: {
      profile: IProfile;
      userId: string;
    }) => {
      return updateProfile(profile, userId);
    },

    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] });
      queryClient.refetchQueries();
    },
  });

  const [profile, setProfile] = useState<IProfile>({
    name: user?.name || "",
    screen_name: user?.screen_name || "",
    bio: user?.description || "",
    location: user?.location || "",
    website: user?.url || "",
    banner: {
      url: user?.profile_banner_url || "",
      file: undefined,
    },
    avatar: { url: user?.profile_image_url || "", file: undefined },
  });

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState({
    google: false,
    discord: false,
    twitter: false,
  });

  const chooseImage = async (event: any, type: string) => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === "banner" && bannerInputRef.current)
      bannerInputRef.current.value = "";

    if (type === "avatar" && avatarInputRef.current)
      avatarInputRef.current.value = "";

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({
        ...profile,
        [type]: { url: reader.result as string, file },
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSignIn = useCallback(
    (provider: string) => {
      setIsLoading((prev) => ({ ...prev, [provider]: true }));

      signIn(provider, {
        callbackUrl: pathname,
        redirect: false,
      }).finally(() => {
        setIsLoading((prev) => ({ ...prev, [provider]: false }));
      });
    },
    [pathname],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.2 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <CloseButton
          onClick={() => closeModal()}
          ariaLabel={innerWidth <= 700 ? "Back" : "Close"}
          title={innerWidth <= 700 ? "Back" : "Close"}
        >
          {innerWidth <= 700 ? <BackArrowIcon /> : <CloseIcon />}
        </CloseButton>

        <h2>Edit Profile</h2>

        <button
          aria-label="Save"
          onClick={() => mutation.mutate({ profile, userId: user.id })}
          disabled={profile?.name.length === 0}
          className={styles.save}
        >
          Save
        </button>
      </div>

      <div className={styles.banner}>
        {profile?.banner?.url && (
          <Image
            src={profile?.banner?.url}
            alt="banner"
            width={500}
            height={500}
          />
        )}

        <input
          accept="image/jpeg,image/png,image/webp"
          tabIndex={-1}
          className={styles.bannerInput}
          type="file"
          ref={bannerInputRef}
          onChange={(e) => chooseImage(e, "banner")}
        />
        <div className={styles.actions}>
          <InputButton
            ariaLabel="Add banner photo"
            title="Add photo"
            onClick={() => {
              bannerInputRef.current?.click();
            }}
          >
            <CameraIcon />
          </InputButton>

          {profile?.banner?.url && (
            <InputButton
              ariaLabel="Remove banner photo"
              title="Remove photo"
              onClick={() => {
                setProfile({
                  ...profile,
                  banner: { url: "", file: undefined },
                });
              }}
            >
              <CloseIcon />
            </InputButton>
          )}
        </div>
      </div>

      <div className={styles.avatar}>
        <Image
          src={
            profile?.avatar?.file
              ? (profile?.avatar?.url as string)
              : user?.profile_image_url
                ? user?.profile_image_url
                : `/user_placeholder.png`
          }
          alt="avatar"
          width={500}
          height={500}
        />

        <input
          className={styles.avatarInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          tabIndex={-1}
          ref={avatarInputRef}
          onChange={(e) => chooseImage(e, "avatar")}
        />
        <div className={styles.chooseAvatar}>
          <InputButton
            ariaLabel="Add avatar photo"
            title="Add photo"
            onClick={() => {
              avatarInputRef.current?.click();
            }}
          >
            <CameraIcon />
          </InputButton>
        </div>
      </div>

      <div className={styles.form}>
        {/* <TextInput
          id="name"
          name="name"
          onChange={(e) => {
            setProfile((prev: IProfile) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
          placeholder="Name"
          value={profile.name}
          maxLength={50}
          isError={profile?.name.length === 0}
          errorMessage="Name can't be blank"
        /> */}

        <UsernameSwitch user={user} setProfile={setProfile} />

        <TextInput
          id="bio"
          name="bio"
          placeholder="Bio"
          value={profile.bio || ""}
          onChange={(e) => {
            setProfile((prev: IProfile) => ({
              ...prev,
              bio: e.target.value,
            }));
          }}
          maxLength={160}
        />

        <TextInput
          id="location"
          name="location"
          placeholder="Location"
          value={profile.location || ""}
          onChange={(e) => {
            setProfile((prev: IProfile) => ({
              ...prev,
              location: e.target.value,
            }));
          }}
          maxLength={30}
        />

        <TextInput
          id="website"
          name="website"
          placeholder="Website"
          value={profile.website || ""}
          onChange={(e) => {
            setProfile((prev: IProfile) => ({
              ...prev,
              website: e.target.value,
            }));
          }}
          maxLength={100}
        />

        <div className={styles.socials}>
          <div className={styles.link}>
            <div className={styles.title}>Google</div>
            {user.google_username && user.google_email && (
              <div className={styles.detail}>
                <div className={styles.item}>
                  <div>Name</div>
                  <div>{user.google_username}</div>
                </div>
                <div className={styles.item}>
                  <div>Email</div>
                  <div>{user.google_email}</div>
                </div>
              </div>
            )}
            <SocialButton
              text="Link Google"
              isLoading={isLoading.google}
              onClick={() => handleSignIn("google")}
            />
          </div>
          <div className={styles.link}>
            <div className={styles.title}>Discord</div>
            {user.discord_username && user.discord_email && (
              <div className={styles.detail}>
                <div className={styles.item}>
                  <div>Name</div>
                  <div>{user.discord_username}</div>
                </div>
                <div className={styles.item}>
                  <div>Email</div>
                  <div>{user.discord_email}</div>
                </div>
              </div>
            )}
            <SocialButton
              text="Link Discord"
              isLoading={isLoading.discord}
              onClick={() => handleSignIn("discord")}
            />
          </div>
          <div className={styles.link}>
            <div className={styles.title}>Twitter</div>
            {user.twitter_username && user.twitter_email && (
              <div className={styles.detail}>
                <div className={styles.item}>
                  <div>Name</div>
                  <div>{user.twitter_username}</div>
                </div>
                <div className={styles.item}>
                  <div>Email</div>
                  <div>{user.twitter_email}</div>
                </div>
              </div>
            )}
            <SocialButton
              text="Link Twitter"
              isLoading={isLoading.twitter}
              onClick={() => handleSignIn("twitter")}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InputButton = ({
  ariaLabel,
  title,
  onClick,
  children,
}: {
  ariaLabel: string;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      aria-label={ariaLabel}
      data-title={title}
      onClick={onClick}
      className={styles.inputButton}
    >
      {children}
    </button>
  );
};

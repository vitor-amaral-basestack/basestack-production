import React, { useEffect, useState } from "react";
import Link from "next/link";
// Styles
import { rem } from "polished";
import { useTheme } from "styled-components";
// Form
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Utils
import { z } from "zod";
import { redirectionUrl } from "utils/constants";
import toast from "react-hot-toast";
// Analytics
import { usePiwikPro } from "@piwikpro/next-piwik-pro";
// Components
import Image from "../Image";
import { Button, ButtonSize, Text } from "@basestack/design-system";
import {
  Container,
  ContentContainer,
  ImageContainer,
  TextContainer,
  Input,
  InputContainer,
  Header,
  Grid,
  Footer,
  InputWrapper,
  LeftCol,
  CardsContainer,
  ErrorContainer,
  ErrorText,
} from "./styles";
import SlideCard from "../SlideCard";

interface WaitingListProps {
  data: Array<{
    icon: string;
    title: string;
    text: string;
    image: { src: string; alt: string };
  }>;
}

export const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Required field")
    .email("This is not a valid email."),
});

export type FormInputs = z.TypeOf<typeof FormSchema>;

const WaitingList = ({ data }: WaitingListProps) => {
  const { PageViews, CustomEvent } = usePiwikPro();
  const theme = useTheme();
  const [currentImage, setCurrentImage] = useState(0);

  const image = {
    src: data[currentImage].image.src,
    alt: data[currentImage].image.alt,
  };

  useEffect(() => {
    PageViews.trackPageView("Early Access Page View");
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentImage + 1) % data.length;
      setCurrentImage(nextIndex);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [currentImage, data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormInputs> = async (input: FormInputs) => {
    try {
      const params = new URLSearchParams({
        includeListId: "4", // Feature Flags Early Access
        email: input.email,
        templateId: "1", // Default Template Double opt-in confirmation
        redirectionUrl,
      });

      const res = await fetch(
        `https://basestack-email.vercel.app/api/v1/email/subscribe?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.code === "permission_denied" || data.error) {
        throw new Error(data.message);
      }

      CustomEvent.trackEvent("Success", "Successfully sent email to confirm");
      toast.success("A confirmation email has been sent to your inbox.");
      reset();
    } catch (error) {
      const { message } = error as Error;
      CustomEvent.trackEvent("Error", message);
      toast.error(message ?? "Something went wrong, please try again.");
    }
  };

  return (
    <Container>
      <ContentContainer>
        <Header>
          <Text
            size="xxLarge"
            fontWeight={700}
            lineHeight="1.6"
            fontFamily="robotoFlex"
          >
            Basestack
          </Text>
        </Header>

        <TextContainer>
          <Text
            size="xxLarge"
            fontSize={rem("60px")}
            lineHeight="1.2"
            fontFamily="robotoFlex"
            // @ts-ignore
            as="h1"
            color={theme.colors.black}
            mb={theme.spacing.s5}
            fontWeight={800}
          >
            The Essential Stack for Developers and Startups
          </Text>
          <Text
            size="xxLarge"
            fontWeight={400}
            lineHeight="1.6"
            // @ts-ignore
            as="p"
            color={theme.colors.gray500}
          >
            Feature Flags are just the beginning: Our Suite of Tools will
            include Feedback, Forms, and more to help you build better Products!
          </Text>
        </TextContainer>

        <Grid>
          <LeftCol>
            <InputContainer>
              <InputWrapper>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      onFocus={() =>
                        CustomEvent.trackEvent(
                          "onFocus",
                          "Email Input Field Focus"
                        )
                      }
                    />
                  )}
                />
                <Button
                  onClick={handleSubmit(onSubmit)}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  size={ButtonSize.Medium}
                  flexShrink={0}
                  {...(isSubmitting ? {} : { icon: "arrow_forward" })}
                >
                  Get Early Access
                </Button>
              </InputWrapper>
              {!!errors.email?.message && (
                <ErrorContainer>
                  <ErrorText
                    size="small"
                    color={
                      !!errors.email
                        ? theme.colors.red400
                        : theme.colors.gray500
                    }
                  >
                    {errors.email?.message}
                  </ErrorText>
                </ErrorContainer>
              )}
            </InputContainer>
            <CardsContainer>
              {data?.map((item, index) => (
                <SlideCard
                  key={index}
                  isActive={index === currentImage}
                  icon={item.icon}
                  title={item.title}
                  text={item.text}
                  onClick={() => {
                    CustomEvent.trackEvent("Feature Slider", item.title);
                    setCurrentImage(index);
                  }}
                />
              ))}
            </CardsContainer>
          </LeftCol>
          <ImageContainer>
            <Image src={image.src} alt={image.alt} />
          </ImageContainer>
        </Grid>

        <Footer>
          <Text size="medium" fontWeight={400} muted>
            © Basestack {new Date().getFullYear()}. All rights reserved.{" "}
            <Link
              style={{ color: "black" }}
              href="/legal/privacy"
              onClick={() =>
                CustomEvent.trackEvent("onClick", "Privacy Policy Link")
              }
            >
              Privacy Policy
            </Link>
          </Text>
        </Footer>
      </ContentContainer>
    </Container>
  );
};

export default WaitingList;
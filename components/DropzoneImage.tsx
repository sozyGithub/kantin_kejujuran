import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Upload, Photo, X, Icon as TablerIcon } from "tabler-icons-react";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

    <div>
      <Text size="xl" inline>
        Tarik gambar ke area ini atau pilih file.
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        File gambar dalam format .png, .gif, .jpeg, .svg+xml, .webp maksimum 5
        MB.
      </Text>
    </div>
  </Group>
);

const DropzoneImage = (props: any) => {
  const theme = useMantineTheme();

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async (files: File[]) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "my-uploads");
    const dataRes = await fetch(
      process.env.NEXT_PUBLIC_CLOUDINARY_URL as string,
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => {
      return r.json();
    });
    props.handleImageUrl(dataRes.secure_url);
    setIsUploading(false);
  };

  return (
    <Dropzone
      onDrop={(files) => {
        handleUploadImage(files);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={5 * 10 ** 6}
      accept={IMAGE_MIME_TYPE}
      multiple={false}
      loading={isUploading}
    >
      {(status) => dropzoneChildren(status, theme)}
    </Dropzone>
  );
};

export default DropzoneImage;

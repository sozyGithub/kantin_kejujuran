import { useState } from "react";
import { Modal, Button, Group, Paper, Avatar } from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";
const IDInfoModalComp = () => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayBlur={3}
        title="ID Siswa"
      >
        <div className="space-y-2">
          <p>
            ID siswa terdiri dari <b>5 digit angka dari 0-9</b>. Dua digit
            terakhir adalah jumlah dari tiga digit sebelumnya.
          </p>
          <p className="font-bold text-gray-600">Contoh:</p>
          <Paper p="xs" className="border border-gray-300" shadow="sm">
            <p className="font-semibold text-emerald-500">45615</p>
            <p>Jumlah tiga digit pertama: 4 + 5 + 6 = 15</p>
            <p>ID: 45615</p>
          </Paper>
          <Paper p="xs" className="border border-gray-300" shadow="sm">
            <p className="font-semibold text-emerald-500">41207</p>
            <p>Jumlah tiga digit pertama: 4 + 1 + 2 = 7</p>
            <p>ID: 41207</p>
          </Paper>
        </div>
      </Modal>

      <div
        className="w-content shadow rounded-full cursor-pointer"
        onClick={() => setOpened(true)}
      >
        <Avatar radius="xl">
          <InfoCircle />
        </Avatar>
      </div>
    </>
  );
};

export default IDInfoModalComp;

import { useState } from "react";
import { Modal, Button, Group, Divider } from "@mantine/core";
import { ArrowRight } from "tabler-icons-react";
const ModalConfirmHook = (props: any) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Konfirmasi Penarikan Saldo"
        centered
      >
        <div>
          <p className="font-semibold">Berikut detail penarikan Anda:</p>
          <Divider my="sm" />
          <p>Pendapatan: Rp{props.income}</p>
          <p>
            Input:{" "}
            <span className="font-bold text-indigo-500">Rp{props.input}</span>
          </p>
          <div className="flex justify-end space-x-1">
            <Button
              onClick={() => {
                setOpened(false);
              }}
              variant="light"
              color="pink"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                props.handleHookIncome();
                setOpened(false);
              }}
              variant="light"
            >
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>

      <Button
        onClick={() => {
          setOpened(true);
        }}
        disabled={+props.input.split(".").join("") > 0 ? false : true}
        variant="light"
        rightIcon={<ArrowRight size={15} />}
      >
        Lanjut
      </Button>
    </>
  );
};

export default ModalConfirmHook;

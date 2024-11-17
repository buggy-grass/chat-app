import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Field,
  Input,
} from "@fluentui/react-components";
import LoadingButton from "../buttons/LoadingButton";
import ServerManager from "../../services/server/ServerManager";

interface CreateSpeakRoomProps {
  serverId: string;
  open: boolean;
  onClose: () => void;
}

const CreateSpeakRoom: React.FC<CreateSpeakRoomProps> = ({
  serverId,
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState<string>("");

  const handleCreateRoom = async() => {
    setLoading(true);
    const createResult = await ServerManager.createSpeakRoom(roomName, serverId);
    setLoading(false);
  };

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) {
          onClose();
        }
      }}
    >
      <DialogSurface style={{ maxWidth: "400px" }}>
        <DialogBody>
          <DialogTitle>Konuşma Odası Ekle</DialogTitle>
          <DialogContent>
            <Field
              label="Oda Adı"
              validationMessage="This is an error message."
              required={true}
            >
              <Input onChange={(e) => setRoomName(e.target.value)} />
            </Field>
          </DialogContent>
          <DialogActions fluid>
            <DialogTrigger disableButtonEnhancement>
              <Button
                style={{ minHeight: "36px" }}
                appearance="secondary"
                onClick={onClose}
              >
                İptal
              </Button>
            </DialogTrigger>
            <LoadingButton loading={loading} onClick={handleCreateRoom}>
              Oluştur
            </LoadingButton>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default CreateSpeakRoom;

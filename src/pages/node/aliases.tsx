import { useAppDispatch, useAppSelector } from '../../store';
import { useEffect, useRef, useState } from 'react';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { exportToCsv } from '../../utils/helpers';
import { utils } from '@hoprnet/hopr-sdk';
const { APIError } = utils;

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import { SendMessageModal } from '../../components/Modal/node/SendMessageModal';
import RemoveAliasIcon from '../../future-hopr-lib-components/Icons/RemoveAlias';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';

// Modals
import { PingModal } from '../../components/Modal/node/PingModal';
import { CreateAliasModal } from '../../components/Modal/node//AddAliasModal';
import { OpenOrFundChannelModal } from '../../components/Modal/node/OpenOrFundChannelModal';

//Mui
import GetAppIcon from '@mui/icons-material/GetApp';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

function AliasesPage() {
  const dispatch = useAppDispatch();
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const peers = useAppSelector(store => store.node.peers.data)
  const aliasesFetching = useAppSelector((store) => store.node.aliases.isFetching);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [importSuccess, set_importSuccess] = useState(false);
  const [deleteSuccess, set_deleteSuccess] = useState(false);
  const [importErrors, set_importErrors] = useState<
    { status: string | undefined; error: string | undefined; alias: string }[]
  >([]);
  const [deleteErrors, set_deleteErrors] = useState<
    { status: string | undefined; error: string | undefined; alias: string }[]
  >([]);

  useEffect(() => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.getAliasesThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
      );
    }
  }, [loginData]);

  const handleRefresh = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.getAliasesThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
      );
    }
  };


  const getPeerAddressByPeerId = (peerId: string): string | undefined => {

    const peer = peers?.announced.find(peer => peer.peerId === peerId);

    if (!peer) {
      return;
    }
    
    return peer.peerAddress
  }

  const handleExport = () => {
    if (aliases) {
      exportToCsv(
        Object.keys(aliases).map((alias) => ({
          alias: alias,
          peerId: aliases[alias],
        })),
        'aliases.csv'
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCSVUpload = (parsedData: any[]) => {
    for (const data of parsedData) {
      if (data.alias && data.peerId && loginData.apiEndpoint && loginData.apiToken) {
        dispatch(
          actionsAsync.setAliasThunk({
            alias: String(data.alias),
            peerId: String(data.peerId),
            apiEndpoint: loginData.apiEndpoint,
            apiToken: loginData.apiToken,
          })
        )
          .unwrap()
          .then(() => {
            set_importSuccess(true);
            set_importErrors([]);
          })
          .catch((e) => {
            set_importSuccess(false);
            set_importErrors([
              ...importErrors,
              {
                alias: String(data.alias),
                error: e.error,
                status: e.status,
              },
            ]);
          });
      }
    }
  };

  const getPeerAddressFromPeerId = (peerId: string): string | undefined => {
    const peerAddress = peers?.announced.find(peer => peer.peerId === peerId)?.peerAddress;
    return peerAddress;
  }

  const parsedTableData = Object.entries(aliases ?? {}).map(([alias, peerId], key) => {
    return {
      id: peerId,
      key: key.toString(),
      alias,
      peerId,
      peerAddress: getPeerAddressByPeerId(peerId) ?? '',
      actions: (
        <>
          <PingModal peerId={peerId} />
          <OpenOrFundChannelModal
            peerAddress={getPeerAddressByPeerId(peerId)}
            type={'open'}
          />
          <SendMessageModal peerId={peerId} />
          <DeleteAliasButton
            onSuccess={() => {
              set_deleteSuccess(true);
            }}
            onError={(e) => {
              set_deleteSuccess(false);
              set_deleteErrors([
                ...deleteErrors,
                {
                  alias: String(alias),
                  error: e.error,
                  status: e.status,
                },
              ]);
            }}
            alias={alias}
          />
        </>
      ),
    };
  });

  return (
    <Section
      className="Section--aliases"
      id="Section--aliases"
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title={`ALIASES`}
        refreshFunction={handleRefresh}
        reloading={aliasesFetching}
        actions={
          <>
            <CreateAliasModal handleRefresh={handleRefresh} />
            <CSVUploader onParse={handleCSVUpload} />
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText={
                <span>
                  EXPORT
                  <br />
                  aliases as a CSV
                </span>
              }
              disabled={aliases !== null && Object.keys(aliases).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <TablePro
        data={parsedTableData}
        search={true}
        header={[
          {
            key: 'alias',
            name: 'Alias',
            search: true,
            tooltip: true,
            maxWidth: '0px',
          },
          {
            key: 'peerId',
            name: 'Peer Id',
            search: true,
            tooltip: true,
            copy: true,
            maxWidth: '60px',
          },
          {
            key: 'peerAddress',
            name: 'Peer Address',
            search: true,
            tooltip: true,
            copy: true,
            maxWidth: '60px',
          },
          {
            key: 'actions',
            name: 'Actions',
            search: false,
            width: '168px',
            maxWidth: '168px',
          },
        ]}
        loading={parsedTableData.length === 0 && aliasesFetching}
      />
    </Section>
  );
}

function DeleteAliasButton({
  alias,
  onError,
  onSuccess,
}: {
  alias: string;
  onError: (e: typeof APIError.prototype) => void;
  onSuccess: () => void;
}) {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);

  return (
    <IconButton
      iconComponent={<RemoveAliasIcon />}
      aria-label="delete alias"
      tooltipText={
        <span>
          DELETE
          <br />
          alias
        </span>
      }
      onClick={() => {
        if (loginData.apiEndpoint && loginData.apiToken) {
          dispatch(
            actionsAsync.removeAliasThunk({
              alias,
              apiEndpoint: loginData.apiEndpoint,
              apiToken: loginData.apiToken,
            })
          )
            .unwrap()
            .then(() => {
              onSuccess();
            })
            .catch((e) => onError(e));
        }
      }}
    />
  );
}

function CreateAliasForm() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [error, set_error] = useState<{
    status: string | undefined;
    error: string | undefined;
  }>();
  const [success, set_success] = useState(false);
  const [form, set_form] = useState<{ peerId: string; alias: string }>({
    alias: '',
    peerId: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    set_form({
      ...form,
      [name]: value,
    });
  };

  return (
    <div>
      <input
        type="text"
        name="peerId"
        placeholder="peerId"
        onChange={handleChange}
        value={form.peerId}
      />
      <input
        type="text"
        name="alias"
        placeholder="alias"
        onChange={handleChange}
        value={form.alias}
      />
      <button
        disabled={form.alias.length === 0 || form.peerId.length === 0}
        onClick={() => {
          if (loginData.apiEndpoint && loginData.apiToken) {
            dispatch(
              actionsAsync.setAliasThunk({
                alias: form.alias,
                peerId: form.peerId,
                apiEndpoint: loginData.apiEndpoint,
                apiToken: loginData.apiToken,
              })
            )
              .unwrap()
              .then(() => {
                set_success(true);
                set_error(undefined);
              })
              .catch((e) => {
                set_success(false);
                set_error({
                  error: e.error,
                  status: e.status,
                });
              });
          }
        }}
      >
        add
      </button>
      <p>{success ? 'created alias!' : error?.status}</p>
    </div>
  );
}

/**
 * Represents the expected structure of the parsed data.
 */
type ParsedData = {
  [key: string]: string | number;
};

/**
 * Props for the CSVUploader component.
 */
type CSVUploaderProps<T extends ParsedData> = {
  /**
   * Callback function called when the CSV data is successfully parsed.
   * @param data The parsed data as an array of objects.
   */
  onParse: (data: T[]) => void;
};

/**
 * Component for uploading and parsing CSV data.
 */
function CSVUploader<T extends ParsedData>({ onParse }: CSVUploaderProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the file upload event.
   * @param event The file upload event.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const contents = e.target?.result;
      if (typeof contents === 'string') {
        parseCSV(contents);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  /**
   * Parses the CSV content.
   * @param csvContent The content of the CSV file.
   */
  const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n');
    const parsedData: T[] = [];

    // gets all keys, csv hold the headers on the first line
    const header = lines[0].split(',');
    const expectedObjectKeys = header.map((key) => key.trim());

    // loop through each line, get the values and assign the value to the key
    // then push the object to array parsedData
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length > 1) {
        const dataObject: T = {} as T;

        for (let j = 0; j < header.length; j++) {
          const key = expectedObjectKeys[j];
          const value = values[j]?.trim();
          if (expectedObjectKeys.includes(key)) {
            dataObject[key as keyof T] = value as T[keyof T];
          }
        }

        parsedData.push(dataObject);
      }
    }

    // after parsing run callback function
    onParse(parsedData);

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <IconButton
        iconComponent={<DriveFolderUploadIcon />}
        tooltipText={
          <span>
            IMPORT
            <br />
            aliases from a CSV
          </span>
        }
        onClick={handleImportClick}
      />

      {/* hidden import */}
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileUpload}
        placeholder="import"
      />
    </div>
  );
}

export default AliasesPage;

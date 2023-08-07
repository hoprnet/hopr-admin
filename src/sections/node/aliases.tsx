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
import { CreateAliasModal } from '../../components/Modal/AddAliasModal';
import { OpenOrFundChannelModal } from '../../components/Modal/OpenOrFundChannelModal';
import { SendMessageModal } from '../../components/Modal/SendMessageModal';
import RemoveAliasIcon from '../../future-hopr-lib-components/Icons/RemoveAlias'

//Mui
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

function AliasesPage() {
  const dispatch = useAppDispatch();
  const aliases = useAppSelector((selector) => selector.node.aliases);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
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
        }),
      );
    }
  }, [loginData]);

  const handleRefresh = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.getAliasesThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        }),
      );
    }
  };

  const handleExport = () => {
    if (aliases) {
      exportToCsv(
        Object.keys(aliases).map((alias) => ({
          alias: alias,
          peerId: aliases[alias],
        })),
        'aliases.csv',
      );
    }
  };

  const handleCSVUpload = (parsedData: any[]) => {
    for (const data of parsedData) {
      if (data.alias && data.peerId && loginData.apiEndpoint && loginData.apiToken) {
        dispatch(
          actionsAsync.setAliasThunk({
            alias: String(data.alias),
            peerId: String(data.peerId),
            apiEndpoint: loginData.apiEndpoint,
            apiToken: loginData.apiToken,
          }),
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

  return (
    <Section
      className="Section--aliases"
      id="Section--aliases"
      yellowLight
      fullHeightMin
    >
      <SubpageTitle
        title={`Aliases`}
        refreshFunction={handleRefresh}
        actions={
          <>
            <CreateAliasModal handleRefresh={handleRefresh} />
            <CSVUploader onParse={handleCSVUpload} />
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText="Export seen peers as a CSV"
              disabled={aliases !== null && Object.keys(aliases).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="aliases table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Peer Id</TableCell>
              <TableCell>Alias</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(aliases ?? {}).map(([alias, peerId], key) => (
              <TableRow key={key}>
                <TableCell
                  component="th"
                  scope="row"
                >
                  {key}
                </TableCell>
                <TableCell>{peerId}</TableCell>
                <TableCell>{alias}</TableCell>
                <TableCell>
                  <OpenOrFundChannelModal
                    peerId={peerId}
                    type={'open'}
                  />
                  <SendMessageModal 
                    peerId={peerId}
                  />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p>{!!importSuccess && 'Imported aliases!'}</p>
      {importErrors.map((error, index) => (
        <p key={index}>
          {error.error}: failed to import alias: {error.alias}
        </p>
      ))}
      <p>{!!deleteSuccess && 'Deleted alias!'}</p>
      {deleteErrors.map((error, index) => (
        <p key={index}>
          {error.error}: failed to delete alias: {error.alias}
        </p>
      ))}
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
  const loginData = useAppSelector((selector) => selector.auth.loginData);

  return (
    <IconButton
      iconComponent={<RemoveAliasIcon />}
      aria-label="delete alias"
      tooltipText={'Delete alias'}
      onClick={() => {
        if (loginData.apiEndpoint && loginData.apiToken) {
          dispatch(
            actionsAsync.removeAliasThunk({
              alias,
              apiEndpoint: loginData.apiEndpoint,
              apiToken: loginData.apiToken,
            }),
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
  const loginData = useAppSelector((selector) => selector.auth.loginData);
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
    const {
      name,
      value,
    } = event.target;
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
              }),
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
        tooltipText="Import aliases from a CSV"
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

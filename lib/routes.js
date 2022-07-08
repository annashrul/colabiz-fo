import {
  UnorderedListOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  AreaChartOutlined,
  ScheduleOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  ApartmentOutlined,
  AlertTwoTone,
  CompassTwoTone,
  CrownTwoTone,
  DiffTwoTone,
  EditTwoTone,
  FireTwoTone,
  FolderTwoTone,
  HomeTwoTone,
  LayoutTwoTone,
  PictureTwoTone,
  PieChartTwoTone,
  QuestionCircleTwoTone,
  ShoppingTwoTone,
  SwitcherTwoTone,
  UnlockTwoTone,
  WarningTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import authAction from "../action/auth.action";
import { StringLink } from "../helper/string_link_helper";
export default [
  {
    path: StringLink.dashboard,
    name: "Dashboard",
    icon: <AreaChartOutlined style={{ fontSize: "16px" }} />,
  },
  {
    path: StringLink.tambahMitra,
    name: "Register",
    icon: <UsergroupAddOutlined style={{ fontSize: "16px" }} />,
  },
  {
    path: StringLink.stockis,
    name: "Daftar Stokis",
    icon: <UnorderedListOutlined style={{ fontSize: "16px" }} />,
  },
  {
    path: StringLink.profile,
    name: "Profil",
    icon: <IdcardOutlined style={{ fontSize: "16px" }} />,
  },

  // {
  //   path: StringLink.address,
  //   name: "Alamat",
  //   icon: <HomeOutlined style={{ fontSize: "16px" }} />,
  // },
  {
    path: StringLink.genealogy,
    name: "Genealogy",
    icon: <ApartmentOutlined style={{ fontSize: "16px" }} />,
  },
  {
    path: StringLink.reportTransaction,
    name: "Laporan",
    icon: <ScheduleOutlined style={{ fontSize: "16px" }} />,
  },
  // {
  //   path: StringLink.withdraw,
  //   name: "Penarikan",
  //   icon: <WalletOutlined style={{ fontSize: "16px" }} />,
  // },
  // {
  //   name: "Laporan",
  //   icon: <ScheduleOutlined style={{ fontSize: "16px" }} />,
  //   children: [

  //     {
  //       path: StringLink.reportTransaction,
  //       name: "Transaksi",
  //     },

  //   ],
  // },
];

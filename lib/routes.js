import {
  UnorderedListOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  AreaChartOutlined,
  ScheduleOutlined,
  UserAddOutlined,
  WalletOutlined,
  UserSwitchOutlined,
  ShoppingCartOutlined,
  ApartmentOutlined,
  RiseOutlined,
  FallOutlined,
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
  // {
  //   path: StringLink.news,
  //   name: "Informasi",
  //   icon: <InfoCircleOutlined style={{ fontSize: "16px" }} />,
  // },
  {
    path: StringLink.tambahMitra,
    name: "Register",
    icon: <UsergroupAddOutlined style={{ fontSize: "16px" }} />,
  },

  {
    path: StringLink.stockis,
    name: "Daftar Stokis",
    icon: <UserAddOutlined style={{ fontSize: "16px" }} />,
  },
  {
    name: "Stokis",
    icon: <UnorderedListOutlined style={{ fontSize: "16px" }} />,
    children: [
      {
        path: StringLink.deposit,
        name: "Deposit",
      },
      // {
      //   path: StringLink.orderStockis,
      //   name: "Order",
      // },
    ],
  },
  // {
  //   path: StringLink.pembelian,
  //   name: "Pembelian",
  //   icon: <ShoppingCartOutlined style={{ fontSize: "16px" }} />,
  // },

  {
    path: StringLink.genealogy,
    name: "Genealogy",
    icon: <ApartmentOutlined style={{ fontSize: "16px" }} />,
  },
  // {
  //   path: StringLink.withdraw,
  //   name: "Penarikan",
  //   icon: <FallOutlined style={{ fontSize: "16px" }} />,
  // },
  // {
  //   name: "Laporan",
  //   icon: <ScheduleOutlined style={{ fontSize: "16px" }} />,
  //   children: [
  //     {
  //       path: StringLink.reportTransaction,
  //       name: "Transaksi",
  //     },
  //     {
  //       path: StringLink.reportPurchase,
  //       name: "Pembelian",
  //     },
  //   ],
  // },
];

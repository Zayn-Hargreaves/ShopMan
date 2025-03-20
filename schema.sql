--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Cart" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    total numeric NOT NULL,
    status character varying(255) NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO avnadmin;

--
-- Name: CartDetails; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."CartDetails" (
    id integer NOT NULL,
    "CartId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."CartDetails" OWNER TO avnadmin;

--
-- Name: CartDetails_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."CartDetails_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartDetails_id_seq" OWNER TO avnadmin;

--
-- Name: CartDetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."CartDetails_id_seq" OWNED BY public."CartDetails".id;


--
-- Name: Cart_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cart_id_seq" OWNER TO avnadmin;

--
-- Name: Cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Cart_id_seq" OWNED BY public."Cart".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    status character varying(255) NOT NULL,
    slug character varying(255),
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone,
    "ParentId" integer
);


ALTER TABLE public."Category" OWNER TO avnadmin;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO avnadmin;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    rating integer,
    content character varying(255) NOT NULL,
    "left" integer NOT NULL,
    "right" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO avnadmin;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO avnadmin;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Discounts; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Discounts" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    value numeric NOT NULL,
    type character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "MaxUses" integer NOT NULL,
    "UserCounts" integer NOT NULL,
    "MinValueOrders" numeric NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    "ShopId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Discounts" OWNER TO avnadmin;

--
-- Name: DiscountsProducts; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."DiscountsProducts" (
    id integer NOT NULL,
    "DiscountId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."DiscountsProducts" OWNER TO avnadmin;

--
-- Name: DiscountsProducts_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."DiscountsProducts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DiscountsProducts_id_seq" OWNER TO avnadmin;

--
-- Name: DiscountsProducts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."DiscountsProducts_id_seq" OWNED BY public."DiscountsProducts".id;


--
-- Name: Discounts_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Discounts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Discounts_id_seq" OWNER TO avnadmin;

--
-- Name: Discounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Discounts_id_seq" OWNED BY public."Discounts".id;


--
-- Name: Follow; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Follow" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "ShopId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Follow" OWNER TO avnadmin;

--
-- Name: Follow_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Follow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Follow_id_seq" OWNER TO avnadmin;

--
-- Name: Follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Follow_id_seq" OWNED BY public."Follow".id;


--
-- Name: Inventories; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Inventories" (
    id integer NOT NULL,
    "ProductId" integer NOT NULL,
    "ShopId" integer NOT NULL,
    quantity integer NOT NULL,
    location character varying(255) NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Inventories" OWNER TO avnadmin;

--
-- Name: Inventories_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Inventories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Inventories_id_seq" OWNER TO avnadmin;

--
-- Name: Inventories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Inventories_id_seq" OWNED BY public."Inventories".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    type character varying(255) NOT NULL,
    option character varying(255) NOT NULL,
    content character varying(255) NOT NULL,
    "ShopId" integer NOT NULL,
    "UserId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO avnadmin;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO avnadmin;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: Opt; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Opt" (
    id integer NOT NULL,
    value character varying(255) NOT NULL,
    "UserId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone
);


ALTER TABLE public."Opt" OWNER TO avnadmin;

--
-- Name: Opt_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Opt_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Opt_id_seq" OWNER TO avnadmin;

--
-- Name: Opt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Opt_id_seq" OWNED BY public."Opt".id;


--
-- Name: OrderDetails; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."OrderDetails" (
    id integer NOT NULL,
    "OrderId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."OrderDetails" OWNER TO avnadmin;

--
-- Name: OrderDetails_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."OrderDetails_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderDetails_id_seq" OWNER TO avnadmin;

--
-- Name: OrderDetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."OrderDetails_id_seq" OWNED BY public."OrderDetails".id;


--
-- Name: Orders; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Orders" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "TotalPrice" numeric NOT NULL,
    "Status" character varying(255) NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Orders" OWNER TO avnadmin;

--
-- Name: Orders_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Orders_id_seq" OWNER TO avnadmin;

--
-- Name: Orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Orders_id_seq" OWNED BY public."Orders".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "UserId" integer,
    "TotalPrice" numeric NOT NULL,
    "Status" character varying(255) NOT NULL,
    "OrderId" integer NOT NULL,
    "PaymentMethodId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO avnadmin;

--
-- Name: PaymentMethod; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."PaymentMethod" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "UserId" integer NOT NULL
);


ALTER TABLE public."PaymentMethod" OWNER TO avnadmin;

--
-- Name: PaymentMethod_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."PaymentMethod_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PaymentMethod_id_seq" OWNER TO avnadmin;

--
-- Name: PaymentMethod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."PaymentMethod_id_seq" OWNED BY public."PaymentMethod".id;


--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO avnadmin;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Permissions; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Permissions" (
    id integer NOT NULL,
    value character varying(255) NOT NULL,
    "group" character varying(255) NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone
);


ALTER TABLE public."Permissions" OWNER TO avnadmin;

--
-- Name: Permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Permissions_id_seq" OWNER TO avnadmin;

--
-- Name: Permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Permissions_id_seq" OWNED BY public."Permissions".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    price numeric NOT NULL,
    quantity integer NOT NULL,
    image character varying(255),
    type character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    slug character varying(255),
    "CategoryId" integer NOT NULL,
    "ShopId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone
);


ALTER TABLE public."Product" OWNER TO avnadmin;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO avnadmin;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone
);


ALTER TABLE public."Role" OWNER TO avnadmin;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO avnadmin;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: RolesPermissions; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."RolesPermissions" (
    id integer NOT NULL,
    "RoleId" integer NOT NULL,
    "PermissionsId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."RolesPermissions" OWNER TO avnadmin;

--
-- Name: RolesPermissions_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."RolesPermissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RolesPermissions_id_seq" OWNER TO avnadmin;

--
-- Name: RolesPermissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."RolesPermissions_id_seq" OWNED BY public."RolesPermissions".id;


--
-- Name: Shop; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Shop" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "ShopName" character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'inactive'::character varying NOT NULL,
    description character varying(255),
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone,
    "RoleId" integer NOT NULL
);


ALTER TABLE public."Shop" OWNER TO avnadmin;

--
-- Name: Shop_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Shop_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Shop_id_seq" OWNER TO avnadmin;

--
-- Name: Shop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Shop_id_seq" OWNED BY public."Shop".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    phone character varying(255),
    avatar character varying(255),
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    address character varying(255),
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL,
    "deletedAt" timestamp(6) with time zone
);


ALTER TABLE public."User" OWNER TO avnadmin;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO avnadmin;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: WishLists; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."WishLists" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."WishLists" OWNER TO avnadmin;

--
-- Name: WishLists_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."WishLists_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WishLists_id_seq" OWNER TO avnadmin;

--
-- Name: WishLists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."WishLists_id_seq" OWNED BY public."WishLists".id;


--
-- Name: Cart id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Cart" ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);


--
-- Name: CartDetails id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartDetails" ALTER COLUMN id SET DEFAULT nextval('public."CartDetails_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Discounts id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts" ALTER COLUMN id SET DEFAULT nextval('public."Discounts_id_seq"'::regclass);


--
-- Name: DiscountsProducts id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts" ALTER COLUMN id SET DEFAULT nextval('public."DiscountsProducts_id_seq"'::regclass);


--
-- Name: Follow id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follow" ALTER COLUMN id SET DEFAULT nextval('public."Follow_id_seq"'::regclass);


--
-- Name: Inventories id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories" ALTER COLUMN id SET DEFAULT nextval('public."Inventories_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Opt id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Opt" ALTER COLUMN id SET DEFAULT nextval('public."Opt_id_seq"'::regclass);


--
-- Name: OrderDetails id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrderDetails" ALTER COLUMN id SET DEFAULT nextval('public."OrderDetails_id_seq"'::regclass);


--
-- Name: Orders id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: PaymentMethod id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."PaymentMethod" ALTER COLUMN id SET DEFAULT nextval('public."PaymentMethod_id_seq"'::regclass);


--
-- Name: Permissions id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Permissions" ALTER COLUMN id SET DEFAULT nextval('public."Permissions_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: RolesPermissions id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RolesPermissions" ALTER COLUMN id SET DEFAULT nextval('public."RolesPermissions_id_seq"'::regclass);


--
-- Name: Shop id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shop" ALTER COLUMN id SET DEFAULT nextval('public."Shop_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: WishLists id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists" ALTER COLUMN id SET DEFAULT nextval('public."WishLists_id_seq"'::regclass);


--
-- Name: CartDetails CartDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartDetails"
    ADD CONSTRAINT "CartDetails_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: DiscountsProducts DiscountsProducts_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_pkey" PRIMARY KEY (id, "DiscountId", "ProductId");


--
-- Name: Discounts Discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT "Discounts_pkey" PRIMARY KEY (id);


--
-- Name: Follow Follow_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (id);


--
-- Name: Inventories Inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories"
    ADD CONSTRAINT "Inventories_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Opt Opt_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Opt"
    ADD CONSTRAINT "Opt_pkey" PRIMARY KEY (id);


--
-- Name: OrderDetails OrderDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrderDetails"
    ADD CONSTRAINT "OrderDetails_pkey" PRIMARY KEY (id, "OrderId", "ProductId");


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: PaymentMethod PaymentMethod_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."PaymentMethod"
    ADD CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Permissions Permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: RolesPermissions RolesPermissions_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RolesPermissions"
    ADD CONSTRAINT "RolesPermissions_pkey" PRIMARY KEY (id);


--
-- Name: Shop Shop_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shop"
    ADD CONSTRAINT "Shop_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WishLists WishLists_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists"
    ADD CONSTRAINT "WishLists_pkey" PRIMARY KEY (id, "UserId", "ProductId");


--
-- Name: Category category_slug_unique; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT category_slug_unique UNIQUE (slug);


--
-- Name: Product product_slug_unique; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT product_slug_unique UNIQUE (slug);


--
-- Name: CartDetails CartDetails_CartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartDetails"
    ADD CONSTRAINT "CartDetails_CartId_fkey" FOREIGN KEY ("CartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartDetails CartDetails_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartDetails"
    ADD CONSTRAINT "CartDetails_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cart Cart_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_ParentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DiscountsProducts DiscountsProducts_DiscountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_DiscountId_fkey" FOREIGN KEY ("DiscountId") REFERENCES public."Discounts"(id);


--
-- Name: DiscountsProducts DiscountsProducts_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discounts Discounts_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT "Discounts_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inventories Inventories_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories"
    ADD CONSTRAINT "Inventories_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inventories Inventories_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories"
    ADD CONSTRAINT "Inventories_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Opt Opt_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Opt"
    ADD CONSTRAINT "Opt_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderDetails OrderDetails_OrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrderDetails"
    ADD CONSTRAINT "OrderDetails_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderDetails OrderDetails_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrderDetails"
    ADD CONSTRAINT "OrderDetails_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Orders Orders_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaymentMethod PaymentMethod_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."PaymentMethod"
    ADD CONSTRAINT "PaymentMethod_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_OrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id);


--
-- Name: Payment Payment_PaymentMethodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_PaymentMethodId_fkey" FOREIGN KEY ("PaymentMethodId") REFERENCES public."PaymentMethod"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id);


--
-- Name: Product Product_CategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolesPermissions RolesPermissions_PermissionsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RolesPermissions"
    ADD CONSTRAINT "RolesPermissions_PermissionsId_fkey" FOREIGN KEY ("PermissionsId") REFERENCES public."Permissions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolesPermissions RolesPermissions_RoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RolesPermissions"
    ADD CONSTRAINT "RolesPermissions_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Shop Shop_RoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shop"
    ADD CONSTRAINT "Shop_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Shop Shop_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shop"
    ADD CONSTRAINT "Shop_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishLists WishLists_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists"
    ADD CONSTRAINT "WishLists_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishLists WishLists_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists"
    ADD CONSTRAINT "WishLists_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


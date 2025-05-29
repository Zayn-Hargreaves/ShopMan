--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

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

--
-- Name: aiven_extras; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA aiven_extras;


ALTER SCHEMA aiven_extras OWNER TO postgres;

--
-- Name: aiven_extras; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS aiven_extras WITH SCHEMA aiven_extras;


--
-- Name: EXTENSION aiven_extras; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION aiven_extras IS 'aiven_extras';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Address" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    address_type character varying(255) NOT NULL,
    pincode integer NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    country character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Address" OWNER TO avnadmin;

--
-- Name: Address_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Address_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Address_id_seq" OWNER TO avnadmin;

--
-- Name: Address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Address_id_seq" OWNED BY public."Address".id;


--
-- Name: Banners; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Banners" (
    id integer NOT NULL,
    banner_type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    thumb character varying(255) NOT NULL,
    link_type character varying(255) NOT NULL,
    link_target character varying(255) NOT NULL,
    "position" integer NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    priority integer NOT NULL,
    status character varying(255) NOT NULL,
    fee numeric NOT NULL,
    "ShopId" integer,
    "PartnerId" integer,
    "CampaignId" integer,
    slug character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "DiscountId" integer
);


ALTER TABLE public."Banners" OWNER TO avnadmin;

--
-- Name: Banners_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Banners_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Banners_id_seq" OWNER TO avnadmin;

--
-- Name: Banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Banners_id_seq" OWNED BY public."Banners".id;


--
-- Name: CampaignCategories; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."CampaignCategories" (
    id integer NOT NULL,
    "CampainId" integer NOT NULL,
    "CategoryId" integer NOT NULL,
    "CampaignId" integer
);


ALTER TABLE public."CampaignCategories" OWNER TO avnadmin;

--
-- Name: CampaignCategories_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."CampaignCategories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CampaignCategories_id_seq" OWNER TO avnadmin;

--
-- Name: CampaignCategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."CampaignCategories_id_seq" OWNED BY public."CampaignCategories".id;


--
-- Name: CampaignShops; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."CampaignShops" (
    id integer NOT NULL,
    "CampaignId" integer NOT NULL,
    "ShopId" integer NOT NULL
);


ALTER TABLE public."CampaignShops" OWNER TO avnadmin;

--
-- Name: CampaignShops_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."CampaignShops_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CampaignShops_id_seq" OWNER TO avnadmin;

--
-- Name: CampaignShops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."CampaignShops_id_seq" OWNED BY public."CampaignShops".id;


--
-- Name: Campaigns; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Campaigns" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    status character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Campaigns" OWNER TO avnadmin;

--
-- Name: Campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Campaigns_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Campaigns_id_seq" OWNER TO avnadmin;

--
-- Name: Campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Campaigns_id_seq" OWNED BY public."Campaigns".id;


--
-- Name: Carts; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Carts" (
    id integer NOT NULL,
    "UserId" integer,
    cart_total numeric NOT NULL,
    cart_status character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Carts" OWNER TO avnadmin;

--
-- Name: CartsDetails; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."CartsDetails" (
    "CartId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    sku_no character varying(255) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."CartsDetails" OWNER TO avnadmin;

--
-- Name: CartsDetails_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."CartsDetails_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartsDetails_id_seq" OWNER TO avnadmin;

--
-- Name: CartsDetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."CartsDetails_id_seq" OWNED BY public."CartsDetails".id;


--
-- Name: Carts_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Carts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Carts_id_seq" OWNER TO avnadmin;

--
-- Name: Carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Carts_id_seq" OWNED BY public."Carts".id;


--
-- Name: Categories; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Categories" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "desc" character varying(255),
    status character varying(255) NOT NULL,
    thumb character varying(255),
    slug character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    "ParentId" integer
);


ALTER TABLE public."Categories" OWNER TO avnadmin;

--
-- Name: Categories_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Categories_id_seq" OWNER TO avnadmin;

--
-- Name: Categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Categories_id_seq" OWNED BY public."Categories".id;


--
-- Name: Comments; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    rating integer,
    content character varying(255) NOT NULL,
    "left" integer NOT NULL,
    "right" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Comments" OWNER TO avnadmin;

--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comments_id_seq" OWNER TO avnadmin;

--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: Discounts; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Discounts" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "desc" character varying(255),
    value numeric NOT NULL,
    type character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "MaxUses" integer NOT NULL,
    "UserCounts" integer NOT NULL,
    "MinValueOrders" numeric NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    "ShopId" integer,
    "CampaignId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Discounts" OWNER TO avnadmin;

--
-- Name: DiscountsProducts; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."DiscountsProducts" (
    id integer NOT NULL,
    "DiscountId" integer,
    "ProductId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
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
-- Name: Follows; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Follows" (
    id integer NOT NULL,
    "UserId" integer,
    "ShopId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Follows" OWNER TO avnadmin;

--
-- Name: Follows_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Follows_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Follows_id_seq" OWNER TO avnadmin;

--
-- Name: Follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Follows_id_seq" OWNED BY public."Follows".id;


--
-- Name: Inventories; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Inventories" (
    id integer NOT NULL,
    "ProductId" integer NOT NULL,
    "ShopId" integer NOT NULL,
    inven_quantity integer NOT NULL,
    inven_location character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
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
-- Name: Notifications; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    type character varying(255) NOT NULL,
    option character varying(255) NOT NULL,
    content character varying(255) NOT NULL,
    "ShopId" integer,
    "UserId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO avnadmin;

--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notifications_id_seq" OWNER TO avnadmin;

--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: Orders; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Orders" (
    id integer NOT NULL,
    "UserId" integer,
    "TotalPrice" numeric NOT NULL,
    "Status" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Orders" OWNER TO avnadmin;

--
-- Name: OrdersDetails; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."OrdersDetails" (
    id integer NOT NULL,
    "OrderId" integer,
    "ProductId" integer,
    quantity integer NOT NULL,
    price_at_time numeric NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."OrdersDetails" OWNER TO avnadmin;

--
-- Name: OrdersDetails_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."OrdersDetails_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrdersDetails_id_seq" OWNER TO avnadmin;

--
-- Name: OrdersDetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."OrdersDetails_id_seq" OWNED BY public."OrdersDetails".id;


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
-- Name: Otps; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Otps" (
    id integer NOT NULL,
    otp_value character varying(255) NOT NULL,
    "UserId" integer NOT NULL,
    expire timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Otps" OWNER TO avnadmin;

--
-- Name: Otps_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Otps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Otps_id_seq" OWNER TO avnadmin;

--
-- Name: Otps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Otps_id_seq" OWNED BY public."Otps".id;


--
-- Name: Partners; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Partners" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    contact_info character varying(255) NOT NULL,
    logo character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Partners" OWNER TO avnadmin;

--
-- Name: Partners_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Partners_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Partners_id_seq" OWNER TO avnadmin;

--
-- Name: Partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Partners_id_seq" OWNED BY public."Partners".id;


--
-- Name: PaymentMethods; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."PaymentMethods" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "desc" character varying(255),
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PaymentMethods" OWNER TO avnadmin;

--
-- Name: PaymentMethods_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."PaymentMethods_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PaymentMethods_id_seq" OWNER TO avnadmin;

--
-- Name: PaymentMethods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."PaymentMethods_id_seq" OWNED BY public."PaymentMethods".id;


--
-- Name: Payments; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Payments" (
    id integer NOT NULL,
    "UserId" integer,
    "TotalPrice" numeric NOT NULL,
    "Status" character varying(255) NOT NULL,
    "OrderId" integer NOT NULL,
    "PaymentMethodId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Payments" OWNER TO avnadmin;

--
-- Name: Payments_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Payments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payments_id_seq" OWNER TO avnadmin;

--
-- Name: Payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Payments_id_seq" OWNED BY public."Payments".id;


--
-- Name: Products; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Products" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "desc" character varying(255),
    desc_plain character varying(255),
    price numeric NOT NULL,
    discount_percentage integer NOT NULL,
    thumb character varying(255),
    attrs jsonb,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    slug character varying(255),
    "CategoryId" integer NOT NULL,
    "CategoryPath" integer[],
    sort integer DEFAULT 10 NOT NULL,
    "ShopId" integer NOT NULL,
    rating double precision DEFAULT '4.5'::double precision,
    sale_count integer DEFAULT 0 NOT NULL,
    has_variations boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Products" OWNER TO avnadmin;

--
-- Name: Products_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Products_id_seq" OWNER TO avnadmin;

--
-- Name: Products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Products_id_seq" OWNED BY public."Products".id;


--
-- Name: Resources; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Resources" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Resources" OWNER TO avnadmin;

--
-- Name: Resources_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Resources_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Resources_id_seq" OWNER TO avnadmin;

--
-- Name: Resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Resources_id_seq" OWNED BY public."Resources".id;


--
-- Name: RoleGrants; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."RoleGrants" (
    id integer NOT NULL,
    "RoleId" integer NOT NULL,
    "ResourceId" integer NOT NULL,
    actions jsonb NOT NULL,
    attributes character varying(255) DEFAULT ''::character varying
);


ALTER TABLE public."RoleGrants" OWNER TO avnadmin;

--
-- Name: COLUMN "RoleGrants".id; Type: COMMENT; Schema: public; Owner: avnadmin
--

COMMENT ON COLUMN public."RoleGrants".id IS 'grant id';


--
-- Name: COLUMN "RoleGrants"."RoleId"; Type: COMMENT; Schema: public; Owner: avnadmin
--

COMMENT ON COLUMN public."RoleGrants"."RoleId" IS 'role id';


--
-- Name: COLUMN "RoleGrants"."ResourceId"; Type: COMMENT; Schema: public; Owner: avnadmin
--

COMMENT ON COLUMN public."RoleGrants"."ResourceId" IS 'resource id';


--
-- Name: COLUMN "RoleGrants".actions; Type: COMMENT; Schema: public; Owner: avnadmin
--

COMMENT ON COLUMN public."RoleGrants".actions IS 'list of actions';


--
-- Name: COLUMN "RoleGrants".attributes; Type: COMMENT; Schema: public; Owner: avnadmin
--

COMMENT ON COLUMN public."RoleGrants".attributes IS 'attributes allowed';


--
-- Name: RoleGrants_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."RoleGrants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RoleGrants_id_seq" OWNER TO avnadmin;

--
-- Name: RoleGrants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."RoleGrants_id_seq" OWNED BY public."RoleGrants".id;


--
-- Name: Roles; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Roles" (
    id integer NOT NULL,
    role_name character varying(255) NOT NULL,
    role_desc character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Roles" OWNER TO avnadmin;

--
-- Name: Roles_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Roles_id_seq" OWNER TO avnadmin;

--
-- Name: Roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Roles_id_seq" OWNED BY public."Roles".id;


--
-- Name: Shops; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Shops" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    name character varying(255) NOT NULL,
    balance numeric DEFAULT 0 NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    "RolesId" integer,
    "desc" character varying(255),
    logo character varying(255),
    "shopLocation" character varying(255),
    rating numeric(2,1) DEFAULT 4.5,
    slug character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    "RoleId" integer
);


ALTER TABLE public."Shops" OWNER TO avnadmin;

--
-- Name: Shops_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Shops_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Shops_id_seq" OWNER TO avnadmin;

--
-- Name: Shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Shops_id_seq" OWNED BY public."Shops".id;


--
-- Name: Sku; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Sku" (
    id integer NOT NULL,
    "ProductId" integer NOT NULL,
    sku_no character varying(255) NOT NULL,
    sku_name character varying(255),
    sku_desc character varying(255),
    sku_type integer,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    sku_stock integer DEFAULT 0 NOT NULL,
    sku_price numeric DEFAULT 0 NOT NULL
);


ALTER TABLE public."Sku" OWNER TO avnadmin;

--
-- Name: SkuAttr; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."SkuAttr" (
    id integer NOT NULL,
    sku_no character varying(255) NOT NULL,
    sku_stock integer DEFAULT 0 NOT NULL,
    sku_price numeric DEFAULT 0 NOT NULL,
    sku_attrs jsonb
);


ALTER TABLE public."SkuAttr" OWNER TO avnadmin;

--
-- Name: SkuAttr_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."SkuAttr_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SkuAttr_id_seq" OWNER TO avnadmin;

--
-- Name: SkuAttr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."SkuAttr_id_seq" OWNED BY public."SkuAttr".id;


--
-- Name: SkuSpecs; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."SkuSpecs" (
    id integer NOT NULL,
    sku_specs jsonb,
    "SkuId" integer NOT NULL
);


ALTER TABLE public."SkuSpecs" OWNER TO avnadmin;

--
-- Name: SkuSpecs_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."SkuSpecs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SkuSpecs_id_seq" OWNER TO avnadmin;

--
-- Name: SkuSpecs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."SkuSpecs_id_seq" OWNED BY public."SkuSpecs".id;


--
-- Name: Sku_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Sku_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sku_id_seq" OWNER TO avnadmin;

--
-- Name: Sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Sku_id_seq" OWNED BY public."Sku".id;


--
-- Name: SpuToSku; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."SpuToSku" (
    id integer NOT NULL,
    sku_no character varying(255) NOT NULL,
    spu_no character varying(255) NOT NULL,
    "ProductId" integer NOT NULL
);


ALTER TABLE public."SpuToSku" OWNER TO avnadmin;

--
-- Name: SpuToSku_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."SpuToSku_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SpuToSku_id_seq" OWNER TO avnadmin;

--
-- Name: SpuToSku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."SpuToSku_id_seq" OWNED BY public."SpuToSku".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    google_id character varying(255),
    phone character varying(255),
    avatar character varying(255),
    balance numeric(10,2) DEFAULT 0,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    "fcmToken" character varying(255)
);


ALTER TABLE public."Users" OWNER TO avnadmin;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO avnadmin;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: WishLists; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."WishLists" (
    id integer NOT NULL,
    "UserId" integer NOT NULL,
    "ProductId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
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
-- Name: Address id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Address" ALTER COLUMN id SET DEFAULT nextval('public."Address_id_seq"'::regclass);


--
-- Name: Banners id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners" ALTER COLUMN id SET DEFAULT nextval('public."Banners_id_seq"'::regclass);


--
-- Name: CampaignCategories id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CampaignCategories" ALTER COLUMN id SET DEFAULT nextval('public."CampaignCategories_id_seq"'::regclass);


--
-- Name: CampaignShops id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CampaignShops" ALTER COLUMN id SET DEFAULT nextval('public."CampaignShops_id_seq"'::regclass);


--
-- Name: Campaigns id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Campaigns" ALTER COLUMN id SET DEFAULT nextval('public."Campaigns_id_seq"'::regclass);


--
-- Name: Carts id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Carts" ALTER COLUMN id SET DEFAULT nextval('public."Carts_id_seq"'::regclass);


--
-- Name: CartsDetails id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartsDetails" ALTER COLUMN id SET DEFAULT nextval('public."CartsDetails_id_seq"'::regclass);


--
-- Name: Categories id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories" ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: Discounts id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts" ALTER COLUMN id SET DEFAULT nextval('public."Discounts_id_seq"'::regclass);


--
-- Name: DiscountsProducts id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts" ALTER COLUMN id SET DEFAULT nextval('public."DiscountsProducts_id_seq"'::regclass);


--
-- Name: Follows id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follows" ALTER COLUMN id SET DEFAULT nextval('public."Follows_id_seq"'::regclass);


--
-- Name: Inventories id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories" ALTER COLUMN id SET DEFAULT nextval('public."Inventories_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: Orders id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);


--
-- Name: OrdersDetails id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrdersDetails" ALTER COLUMN id SET DEFAULT nextval('public."OrdersDetails_id_seq"'::regclass);


--
-- Name: Otps id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Otps" ALTER COLUMN id SET DEFAULT nextval('public."Otps_id_seq"'::regclass);


--
-- Name: Partners id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Partners" ALTER COLUMN id SET DEFAULT nextval('public."Partners_id_seq"'::regclass);


--
-- Name: PaymentMethods id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."PaymentMethods" ALTER COLUMN id SET DEFAULT nextval('public."PaymentMethods_id_seq"'::regclass);


--
-- Name: Payments id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payments" ALTER COLUMN id SET DEFAULT nextval('public."Payments_id_seq"'::regclass);


--
-- Name: Products id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products" ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);


--
-- Name: Resources id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Resources" ALTER COLUMN id SET DEFAULT nextval('public."Resources_id_seq"'::regclass);


--
-- Name: RoleGrants id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RoleGrants" ALTER COLUMN id SET DEFAULT nextval('public."RoleGrants_id_seq"'::regclass);


--
-- Name: Roles id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN id SET DEFAULT nextval('public."Roles_id_seq"'::regclass);


--
-- Name: Shops id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shops" ALTER COLUMN id SET DEFAULT nextval('public."Shops_id_seq"'::regclass);


--
-- Name: Sku id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku" ALTER COLUMN id SET DEFAULT nextval('public."Sku_id_seq"'::regclass);


--
-- Name: SkuAttr id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuAttr" ALTER COLUMN id SET DEFAULT nextval('public."SkuAttr_id_seq"'::regclass);


--
-- Name: SkuSpecs id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuSpecs" ALTER COLUMN id SET DEFAULT nextval('public."SkuSpecs_id_seq"'::regclass);


--
-- Name: SpuToSku id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SpuToSku" ALTER COLUMN id SET DEFAULT nextval('public."SpuToSku_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: WishLists id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists" ALTER COLUMN id SET DEFAULT nextval('public."WishLists_id_seq"'::regclass);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: Banners Banners_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_pkey" PRIMARY KEY (id);


--
-- Name: Banners Banners_slug_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_slug_key" UNIQUE (slug);


--
-- Name: Banners Banners_slug_key1; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_slug_key1" UNIQUE (slug);


--
-- Name: Banners Banners_slug_key2; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_slug_key2" UNIQUE (slug);


--
-- Name: Banners Banners_slug_key3; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_slug_key3" UNIQUE (slug);


--
-- Name: Banners Banners_slug_key4; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_slug_key4" UNIQUE (slug);


--
-- Name: Banners Banners_slug_key5; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_slug_key5" UNIQUE (slug);


--
-- Name: CampaignCategories CampaignCategories_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CampaignCategories"
    ADD CONSTRAINT "CampaignCategories_pkey" PRIMARY KEY (id);


--
-- Name: CampaignShops CampaignShops_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CampaignShops"
    ADD CONSTRAINT "CampaignShops_pkey" PRIMARY KEY (id);


--
-- Name: Campaigns Campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_pkey" PRIMARY KEY (id);


--
-- Name: Carts Carts_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key1; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key1" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key10; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key10" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key2; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key2" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key3; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key3" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key4; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key4" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key5; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key5" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key6; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key6" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key7; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key7" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key8; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key8" UNIQUE (slug);


--
-- Name: Categories Categories_slug_key9; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_slug_key9" UNIQUE (slug);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: DiscountsProducts DiscountsProducts_DiscountId_ProductId_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_DiscountId_ProductId_key" UNIQUE ("DiscountId", "ProductId");


--
-- Name: DiscountsProducts DiscountsProducts_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_pkey" PRIMARY KEY (id);


--
-- Name: Discounts Discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT "Discounts_pkey" PRIMARY KEY (id);


--
-- Name: Follows Follows_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follows"
    ADD CONSTRAINT "Follows_pkey" PRIMARY KEY (id);


--
-- Name: Inventories Inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories"
    ADD CONSTRAINT "Inventories_pkey" PRIMARY KEY (id);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: OrdersDetails OrdersDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrdersDetails"
    ADD CONSTRAINT "OrdersDetails_pkey" PRIMARY KEY (id);


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: Otps Otps_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Otps"
    ADD CONSTRAINT "Otps_pkey" PRIMARY KEY (id);


--
-- Name: Partners Partners_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Partners"
    ADD CONSTRAINT "Partners_pkey" PRIMARY KEY (id);


--
-- Name: PaymentMethods PaymentMethods_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."PaymentMethods"
    ADD CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY (id);


--
-- Name: Payments Payments_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_slug_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key" UNIQUE (slug);


--
-- Name: Products Products_slug_key1; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key1" UNIQUE (slug);


--
-- Name: Products Products_slug_key10; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key10" UNIQUE (slug);


--
-- Name: Products Products_slug_key2; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key2" UNIQUE (slug);


--
-- Name: Products Products_slug_key3; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key3" UNIQUE (slug);


--
-- Name: Products Products_slug_key4; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key4" UNIQUE (slug);


--
-- Name: Products Products_slug_key5; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key5" UNIQUE (slug);


--
-- Name: Products Products_slug_key6; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key6" UNIQUE (slug);


--
-- Name: Products Products_slug_key7; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key7" UNIQUE (slug);


--
-- Name: Products Products_slug_key8; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key8" UNIQUE (slug);


--
-- Name: Products Products_slug_key9; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_slug_key9" UNIQUE (slug);


--
-- Name: Resources Resources_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Resources"
    ADD CONSTRAINT "Resources_pkey" PRIMARY KEY (id);


--
-- Name: RoleGrants RoleGrants_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RoleGrants"
    ADD CONSTRAINT "RoleGrants_pkey" PRIMARY KEY (id);


--
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (id);


--
-- Name: Shops Shops_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shops"
    ADD CONSTRAINT "Shops_pkey" PRIMARY KEY (id);


--
-- Name: SkuAttr SkuAttr_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuAttr"
    ADD CONSTRAINT "SkuAttr_pkey" PRIMARY KEY (id);


--
-- Name: SkuAttr SkuAttr_sku_no_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuAttr"
    ADD CONSTRAINT "SkuAttr_sku_no_key" UNIQUE (sku_no);


--
-- Name: SkuSpecs SkuSpecs_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuSpecs"
    ADD CONSTRAINT "SkuSpecs_pkey" PRIMARY KEY (id);


--
-- Name: Sku Sku_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_pkey" PRIMARY KEY (id);


--
-- Name: Sku Sku_sku_no_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key1; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key1" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key10; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key10" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key2; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key2" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key3; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key3" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key4; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key4" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key5; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key5" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key6; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key6" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key7; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key7" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key8; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key8" UNIQUE (sku_no);


--
-- Name: Sku Sku_sku_no_key9; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Sku"
    ADD CONSTRAINT "Sku_sku_no_key9" UNIQUE (sku_no);


--
-- Name: SpuToSku SpuToSku_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SpuToSku"
    ADD CONSTRAINT "SpuToSku_pkey" PRIMARY KEY (id);


--
-- Name: SpuToSku SpuToSku_sku_no_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SpuToSku"
    ADD CONSTRAINT "SpuToSku_sku_no_key" UNIQUE (sku_no);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: WishLists WishLists_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists"
    ADD CONSTRAINT "WishLists_pkey" PRIMARY KEY (id);


--
-- Name: spu_to_sku_spu_no_sku_no; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX spu_to_sku_spu_no_sku_no ON public."SpuToSku" USING btree (spu_no, sku_no);


--
-- Name: Address Address_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Banners Banners_DiscountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_DiscountId_fkey" FOREIGN KEY ("DiscountId") REFERENCES public."Discounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Banners Banners_PartnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_PartnerId_fkey" FOREIGN KEY ("PartnerId") REFERENCES public."Partners"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Banners Banners_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shops"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CampaignCategories CampaignCategories_CampaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CampaignCategories"
    ADD CONSTRAINT "CampaignCategories_CampaignId_fkey" FOREIGN KEY ("CampaignId") REFERENCES public."Campaigns"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CampaignCategories CampaignCategories_CategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CampaignCategories"
    ADD CONSTRAINT "CampaignCategories_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartsDetails CartsDetails_CartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartsDetails"
    ADD CONSTRAINT "CartsDetails_CartId_fkey" FOREIGN KEY ("CartId") REFERENCES public."Carts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartsDetails CartsDetails_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."CartsDetails"
    ADD CONSTRAINT "CartsDetails_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Carts Carts_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Categories Categories_ParentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comments Comments_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DiscountsProducts DiscountsProducts_DiscountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_DiscountId_fkey" FOREIGN KEY ("DiscountId") REFERENCES public."Discounts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DiscountsProducts DiscountsProducts_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."DiscountsProducts"
    ADD CONSTRAINT "DiscountsProducts_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discounts Discounts_CampaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT "Discounts_CampaignId_fkey" FOREIGN KEY ("CampaignId") REFERENCES public."Campaigns"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Discounts Discounts_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT "Discounts_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shops"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Follows Follows_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follows"
    ADD CONSTRAINT "Follows_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shops"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follows Follows_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Follows"
    ADD CONSTRAINT "Follows_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inventories Inventories_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories"
    ADD CONSTRAINT "Inventories_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inventories Inventories_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Inventories"
    ADD CONSTRAINT "Inventories_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shops"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shops"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrdersDetails OrdersDetails_OrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrdersDetails"
    ADD CONSTRAINT "OrdersDetails_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrdersDetails OrdersDetails_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."OrdersDetails"
    ADD CONSTRAINT "OrdersDetails_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Orders Orders_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Otps Otps_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Otps"
    ADD CONSTRAINT "Otps_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payments Payments_OrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payments Payments_PaymentMethodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_PaymentMethodId_fkey" FOREIGN KEY ("PaymentMethodId") REFERENCES public."PaymentMethods"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payments Payments_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Products Products_CategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Products Products_ShopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_ShopId_fkey" FOREIGN KEY ("ShopId") REFERENCES public."Shops"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RoleGrants RoleGrants_ResourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RoleGrants"
    ADD CONSTRAINT "RoleGrants_ResourceId_fkey" FOREIGN KEY ("ResourceId") REFERENCES public."Resources"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RoleGrants RoleGrants_RoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."RoleGrants"
    ADD CONSTRAINT "RoleGrants_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Shops Shops_RoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shops"
    ADD CONSTRAINT "Shops_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Shops Shops_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shops"
    ADD CONSTRAINT "Shops_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SkuAttr SkuAttr_sku_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuAttr"
    ADD CONSTRAINT "SkuAttr_sku_no_fkey" FOREIGN KEY (sku_no) REFERENCES public."Sku"(sku_no) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SkuSpecs SkuSpecs_SkuId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SkuSpecs"
    ADD CONSTRAINT "SkuSpecs_SkuId_fkey" FOREIGN KEY ("SkuId") REFERENCES public."Sku"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpuToSku SpuToSku_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SpuToSku"
    ADD CONSTRAINT "SpuToSku_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpuToSku SpuToSku_sku_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."SpuToSku"
    ADD CONSTRAINT "SpuToSku_sku_no_fkey" FOREIGN KEY (sku_no) REFERENCES public."Sku"(sku_no) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishLists WishLists_ProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists"
    ADD CONSTRAINT "WishLists_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishLists WishLists_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."WishLists"
    ADD CONSTRAINT "WishLists_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


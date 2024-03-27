// Code generated by SQLBoiler 3.7.1 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"bytes"
	"context"
	"reflect"
	"testing"

	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/randomize"
	"github.com/volatiletech/sqlboiler/strmangle"
)

var (
	// Relationships sometimes use the reflection helper queries.Equal/queries.Assign
	// so force a package dependency in case they don't.
	_ = queries.Equal
)

func testResetTokens(t *testing.T) {
	t.Parallel()

	query := ResetTokens()

	if query.Query == nil {
		t.Error("expected a query, got nothing")
	}
}

func testResetTokensDelete(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := o.Delete(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testResetTokensQueryDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := ResetTokens().DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testResetTokensSliceDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := ResetTokenSlice{o}

	if rowsAff, err := slice.DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testResetTokensExists(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	e, err := ResetTokenExists(ctx, tx, o.ID)
	if err != nil {
		t.Errorf("Unable to check if ResetToken exists: %s", err)
	}
	if !e {
		t.Errorf("Expected ResetTokenExists to return true, but got false.")
	}
}

func testResetTokensFind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	resetTokenFound, err := FindResetToken(ctx, tx, o.ID)
	if err != nil {
		t.Error(err)
	}

	if resetTokenFound == nil {
		t.Error("want a record, got nil")
	}
}

func testResetTokensBind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = ResetTokens().Bind(ctx, tx, o); err != nil {
		t.Error(err)
	}
}

func testResetTokensOne(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if x, err := ResetTokens().One(ctx, tx); err != nil {
		t.Error(err)
	} else if x == nil {
		t.Error("expected to get a non nil record")
	}
}

func testResetTokensAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	resetTokenOne := &ResetToken{}
	resetTokenTwo := &ResetToken{}
	if err = randomize.Struct(seed, resetTokenOne, resetTokenDBTypes, false, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}
	if err = randomize.Struct(seed, resetTokenTwo, resetTokenDBTypes, false, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = resetTokenOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = resetTokenTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := ResetTokens().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 2 {
		t.Error("want 2 records, got:", len(slice))
	}
}

func testResetTokensCount(t *testing.T) {
	t.Parallel()

	var err error
	seed := randomize.NewSeed()
	resetTokenOne := &ResetToken{}
	resetTokenTwo := &ResetToken{}
	if err = randomize.Struct(seed, resetTokenOne, resetTokenDBTypes, false, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}
	if err = randomize.Struct(seed, resetTokenTwo, resetTokenDBTypes, false, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = resetTokenOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = resetTokenTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 2 {
		t.Error("want 2 records, got:", count)
	}
}

func resetTokenBeforeInsertHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenAfterInsertHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenAfterSelectHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenBeforeUpdateHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenAfterUpdateHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenBeforeDeleteHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenAfterDeleteHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenBeforeUpsertHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func resetTokenAfterUpsertHook(ctx context.Context, e boil.ContextExecutor, o *ResetToken) error {
	*o = ResetToken{}
	return nil
}

func testResetTokensHooks(t *testing.T) {
	t.Parallel()

	var err error

	ctx := context.Background()
	empty := &ResetToken{}
	o := &ResetToken{}

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, o, resetTokenDBTypes, false); err != nil {
		t.Errorf("Unable to randomize ResetToken object: %s", err)
	}

	AddResetTokenHook(boil.BeforeInsertHook, resetTokenBeforeInsertHook)
	if err = o.doBeforeInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeInsertHook function to empty object, but got: %#v", o)
	}
	resetTokenBeforeInsertHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.AfterInsertHook, resetTokenAfterInsertHook)
	if err = o.doAfterInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterInsertHook function to empty object, but got: %#v", o)
	}
	resetTokenAfterInsertHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.AfterSelectHook, resetTokenAfterSelectHook)
	if err = o.doAfterSelectHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterSelectHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterSelectHook function to empty object, but got: %#v", o)
	}
	resetTokenAfterSelectHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.BeforeUpdateHook, resetTokenBeforeUpdateHook)
	if err = o.doBeforeUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpdateHook function to empty object, but got: %#v", o)
	}
	resetTokenBeforeUpdateHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.AfterUpdateHook, resetTokenAfterUpdateHook)
	if err = o.doAfterUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpdateHook function to empty object, but got: %#v", o)
	}
	resetTokenAfterUpdateHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.BeforeDeleteHook, resetTokenBeforeDeleteHook)
	if err = o.doBeforeDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeDeleteHook function to empty object, but got: %#v", o)
	}
	resetTokenBeforeDeleteHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.AfterDeleteHook, resetTokenAfterDeleteHook)
	if err = o.doAfterDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterDeleteHook function to empty object, but got: %#v", o)
	}
	resetTokenAfterDeleteHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.BeforeUpsertHook, resetTokenBeforeUpsertHook)
	if err = o.doBeforeUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpsertHook function to empty object, but got: %#v", o)
	}
	resetTokenBeforeUpsertHooks = []ResetTokenHook{}

	AddResetTokenHook(boil.AfterUpsertHook, resetTokenAfterUpsertHook)
	if err = o.doAfterUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpsertHook function to empty object, but got: %#v", o)
	}
	resetTokenAfterUpsertHooks = []ResetTokenHook{}
}

func testResetTokensInsert(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testResetTokensInsertWhitelist(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Whitelist(resetTokenColumnsWithoutDefault...)); err != nil {
		t.Error(err)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testResetTokensReload(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = o.Reload(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testResetTokensReloadAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := ResetTokenSlice{o}

	if err = slice.ReloadAll(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testResetTokensSelect(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := ResetTokens().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 1 {
		t.Error("want one record, got:", len(slice))
	}
}

var (
	resetTokenDBTypes = map[string]string{`ID`: `uuid`, `Email`: `text`, `Token`: `character varying`}
	_                 = bytes.MinRead
)

func testResetTokensUpdate(t *testing.T) {
	t.Parallel()

	if 0 == len(resetTokenPrimaryKeyColumns) {
		t.Skip("Skipping table with no primary key columns")
	}
	if len(resetTokenAllColumns) == len(resetTokenPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	if rowsAff, err := o.Update(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only affect one row but affected", rowsAff)
	}
}

func testResetTokensSliceUpdateAll(t *testing.T) {
	t.Parallel()

	if len(resetTokenAllColumns) == len(resetTokenPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &ResetToken{}
	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, resetTokenDBTypes, true, resetTokenPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	// Remove Primary keys and unique columns from what we plan to update
	var fields []string
	if strmangle.StringSliceMatch(resetTokenAllColumns, resetTokenPrimaryKeyColumns) {
		fields = resetTokenAllColumns
	} else {
		fields = strmangle.SetComplement(
			resetTokenAllColumns,
			resetTokenPrimaryKeyColumns,
		)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	typ := reflect.TypeOf(o).Elem()
	n := typ.NumField()

	updateMap := M{}
	for _, col := range fields {
		for i := 0; i < n; i++ {
			f := typ.Field(i)
			if f.Tag.Get("boil") == col {
				updateMap[col] = value.Field(i).Interface()
			}
		}
	}

	slice := ResetTokenSlice{o}
	if rowsAff, err := slice.UpdateAll(ctx, tx, updateMap); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("wanted one record updated but got", rowsAff)
	}
}

func testResetTokensUpsert(t *testing.T) {
	t.Parallel()

	if len(resetTokenAllColumns) == len(resetTokenPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	// Attempt the INSERT side of an UPSERT
	o := ResetToken{}
	if err = randomize.Struct(seed, &o, resetTokenDBTypes, true); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Upsert(ctx, tx, false, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert ResetToken: %s", err)
	}

	count, err := ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}

	// Attempt the UPDATE side of an UPSERT
	if err = randomize.Struct(seed, &o, resetTokenDBTypes, false, resetTokenPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize ResetToken struct: %s", err)
	}

	if err = o.Upsert(ctx, tx, true, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert ResetToken: %s", err)
	}

	count, err = ResetTokens().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}
}